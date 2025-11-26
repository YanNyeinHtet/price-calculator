
import React, { useMemo, useState } from 'react';
import { CostBreakdown, Scene, VFXShotData, Complexity } from '../types';
import { COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, Activity, Layers, Clock, FileDown, AlertCircle, List, PieChart as PieIcon, Upload, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { calculateBreakdown, formatMoney } from '../utils';

interface ResultsPanelProps {
  activeBreakdown: CostBreakdown;
  activeScene: Scene;
  allScenes: Scene[];
  currencySymbol?: string;
  onImportProject: () => void;
  onExportProject: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  activeBreakdown, 
  activeScene,
  allScenes, 
  currencySymbol = 'MMK',
  onImportProject,
  onExportProject
}) => {
  
  const [activeTab, setActiveTab] = useState<'SCENE' | 'TOTAL'>('SCENE');

  // Chart Data for Active Scene
  const chartData = useMemo(() => {
    return [
      { name: 'Base Cost', value: activeBreakdown.baseCost, color: COLORS.base },
      { name: 'Resolution & FPS', value: activeBreakdown.resolutionCost + activeBreakdown.fpsCost, color: COLORS.resolution },
      { name: 'Prep / Roto', value: activeBreakdown.rotoCost + activeBreakdown.cleanupCost + activeBreakdown.keyingCost, color: COLORS.roto },
      { name: 'Tracking', value: activeBreakdown.trackingCost, color: COLORS.tracking },
      { name: 'Assets', value: activeBreakdown.assetCost, color: COLORS.assets },
      { name: 'Animation', value: activeBreakdown.animationCost, color: COLORS.animation },
      { name: 'FX/Sim', value: activeBreakdown.simulationCost, color: COLORS.simulation },
      { name: 'Compositing', value: activeBreakdown.compositingCost + activeBreakdown.layerAnimCost, color: COLORS.compositing },
      { name: 'Extras', value: activeBreakdown.urgentCost + activeBreakdown.briefCost, color: COLORS.extras },
    ].filter(item => item.value > 0);
  }, [activeBreakdown]);

  // Project Totals Calculation
  const projectSummary = useMemo(() => {
    let grandTotal = 0;
    const sceneSummaries = allScenes.map(scene => {
      const bd = calculateBreakdown(scene.data);
      grandTotal += bd.total;
      return {
        id: scene.id,
        name: scene.name,
        duration: scene.data.duration,
        resolution: scene.data.resolution,
        fps: scene.data.fps,
        total: bd.total
      };
    });
    return { grandTotal, sceneSummaries };
  }, [allScenes]);

  const costPerSecond = activeScene.data.duration > 0 ? activeBreakdown.total / activeScene.data.duration : 0;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 20;

    // Helper: Draw Header
    const drawHeader = (title: string) => {
      // Company Logo / Name
      doc.setFontSize(24);
      doc.setTextColor(220, 38, 38); // Red
      doc.setFont("helvetica", "bold");
      doc.text("Chicken can't fly studio", margin, yPos);
      
      // Invoice Title
      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100); // Gray
      doc.setFont("helvetica", "normal");
      doc.text("VFX Production Estimate", margin, yPos);

      // Contact Details Block
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      const contactX = pageWidth - margin;
      let contactY = 20;
      doc.text("Contact:", contactX, contactY, { align: 'right' });
      contactY += 5;
      doc.text("+959792717361", contactX, contactY, { align: 'right' });
      contactY += 5;
      doc.text("yannyeinhtet@gmail.com", contactX, contactY, { align: 'right' });
      contactY += 5;
      doc.text("www.kaung.cc", contactX, contactY, { align: 'right' });
      contactY += 8;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, contactX, contactY, { align: 'right' });

      // Title Separator
      yPos += 15;
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      // Document Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(title, margin, yPos);
      yPos += 10;
    };

    if (activeTab === 'SCENE') {
      // --- DETAILED SCENE INVOICE ---
      drawHeader(`Estimate Breakdown: ${activeScene.name}`);

      // Scene Specs Box
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 20, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Duration: ${activeScene.data.duration}s`, margin + 10, yPos + 12);
      doc.text(`Resolution: ${activeScene.data.resolution}`, margin + 60, yPos + 12);
      doc.text(`FPS: ${activeScene.data.fps}`, margin + 110, yPos + 12);
      
      yPos += 30;

      // Table Header
      doc.setFillColor(50, 50, 50);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("CATEGORY / ITEM", margin + 5, yPos + 5.5);
      doc.text("COMPLEXITY", margin + 100, yPos + 5.5);
      doc.text("AMOUNT (MMK)", pageWidth - margin - 5, yPos + 5.5, { align: 'right' });
      yPos += 8;

      // Table Content
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      const addRow = (label: string, complexity: string, amount: number, isSubtotal = false) => {
        if (amount === 0 && !isSubtotal && label !== 'Base Price') return;
        
        // Background striping
        if (yPos % 16 >= 8) {
           doc.setFillColor(250, 250, 250);
           doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
        }

        doc.setFont("helvetica", isSubtotal ? "bold" : "normal");
        doc.text(label, margin + 5, yPos + 5.5);
        if (complexity) doc.text(complexity, margin + 100, yPos + 5.5);
        doc.text(amount.toLocaleString(), pageWidth - margin - 5, yPos + 5.5, { align: 'right' });
        
        yPos += 8;
        // Page break check
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
      };

      const d = activeScene.data;
      
      addRow("Base Price (Duration Cost)", `${d.duration} sec @ ${d.basePrice}/s`, activeBreakdown.baseCost);
      if (activeBreakdown.resolutionCost > 0) addRow("Resolution Surcharge", d.resolution, activeBreakdown.resolutionCost);
      
      // Pre-Production
      addRow("Roto", d.roto, activeBreakdown.rotoCost);
      addRow("Cleanup / Paint", d.cleanup, activeBreakdown.cleanupCost);
      addRow("Keying", d.keying, activeBreakdown.keyingCost);
      addRow("Camera Tracking", d.cameraTracking, activeBreakdown.trackingCost); // Simplified tracking summary

      // Assets
      // Fix: Passed activeBreakdown.assetCost (number) instead of a complexity string condition.
      // Changed label to "3D Assets" to represent the aggregated cost of model, rigging, scene, props.
      addRow("3D Assets", d.model3d !== Complexity.NONE ? d.model3d : "Combined", activeBreakdown.assetCost); 
      
      // Animation
      addRow("Animation", d.animation, activeBreakdown.animationCost);
      addRow("Simulation / FX", d.simulation, activeBreakdown.simulationCost);

      // Post
      addRow("Compositing", d.compositing3d !== Complexity.NONE ? d.compositing3d : d.compositing2d, activeBreakdown.compositingCost);
      
      // Extras
      addRow("Urgent Fee", d.urgent, activeBreakdown.urgentCost);
      
      // Discounts
      if (activeBreakdown.managementAdjustment !== 0) {
         doc.setTextColor(220, 160, 0);
         addRow("Management Discount", "Yes (-5%)", activeBreakdown.managementAdjustment);
         doc.setTextColor(0,0,0);
      }
      if (activeBreakdown.reelDiscount !== 0) {
         doc.setTextColor(220, 160, 0);
         addRow("Reel Usage Discount", "Yes (-5%)", activeBreakdown.reelDiscount);
         doc.setTextColor(0,0,0);
      }
      
      // FPS Surcharge (Calculated at end)
      if (activeBreakdown.fpsCost > 0) {
        yPos += 2;
        doc.setFont("helvetica", "italic");
        addRow("60 FPS Surcharge (20% of Total)", "", activeBreakdown.fpsCost);
        doc.setFont("helvetica", "normal");
      }

      // Total Line
      yPos += 5;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SCENE TOTAL", margin + 5, yPos);
      doc.setTextColor(220, 38, 38);
      doc.text(`${activeBreakdown.total.toLocaleString()} MMK`, pageWidth - margin - 5, yPos, { align: 'right' });

    } else {
      // --- PROJECT SUMMARY INVOICE ---
      drawHeader(`Project Summary: ${allScenes.length} Scenes`);

      // Table Header
      doc.setFillColor(50, 50, 50);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("#", margin + 5, yPos + 5.5);
      doc.text("SCENE NAME", margin + 20, yPos + 5.5);
      doc.text("SPECS", margin + 100, yPos + 5.5);
      doc.text("COST (MMK)", pageWidth - margin - 5, yPos + 5.5, { align: 'right' });
      yPos += 8;

      // Table Content
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      projectSummary.sceneSummaries.forEach((scene, index) => {
        if (index % 2 === 0) {
           doc.setFillColor(250, 250, 250);
           doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
        }
        
        doc.text((index + 1).toString(), margin + 5, yPos + 5.5);
        doc.text(scene.name, margin + 20, yPos + 5.5);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`${scene.duration}s | ${scene.resolution} | ${scene.fps}fps`, margin + 100, yPos + 5.5);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(scene.total.toLocaleString(), pageWidth - margin - 5, yPos + 5.5, { align: 'right' });
        
        yPos += 8;
        if (yPos > 270) { doc.addPage(); yPos = 20; }
      });

      // Grand Total
      yPos += 5;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("PROJECT GRAND TOTAL", margin + 5, yPos);
      doc.setTextColor(220, 38, 38);
      doc.text(`${projectSummary.grandTotal.toLocaleString()} MMK`, pageWidth - margin - 5, yPos, { align: 'right' });
    }

    // --- Footer ---
    const footerY = 280;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text("NOTICE: This document is an automated cost estimate and does not constitute a final binding contract.", pageWidth / 2, footerY, { align: 'center' });
    doc.text("For a final quote, please contact Chicken can't fly studio.", pageWidth / 2, footerY + 4, { align: 'center' });

    doc.save(activeTab === 'SCENE' ? `Estimate_${activeScene.name.replace(/\s+/g, '_')}.pdf` : "VFX_Project_Summary.pdf");
  };

  return (
    <div className="bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800 sticky top-6">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('SCENE')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors relative ${
            activeTab === 'SCENE' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <PieIcon size={16} />
          Current Scene
          {activeTab === 'SCENE' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />}
        </button>
        <button
          onClick={() => setActiveTab('TOTAL')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors relative ${
            activeTab === 'TOTAL' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <List size={16} />
          Project Total
          {activeTab === 'TOTAL' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />}
        </button>
      </div>

      <div className="p-6 bg-gradient-to-r from-neutral-900 to-black border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="text-red-500" />
          {activeTab === 'SCENE' ? 'Scene Estimate' : 'Project Summary'}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Main Display Amount */}
        <div className="text-center p-6 bg-black rounded-2xl border border-neutral-800 shadow-inner">
          <p className="text-neutral-500 text-sm uppercase tracking-widest mb-1">
            {activeTab === 'SCENE' ? activeScene.name + ' Total' : 'Grand Total'}
          </p>
          <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
            {formatMoney(activeTab === 'SCENE' ? activeBreakdown.total : projectSummary.grandTotal, currencySymbol)}
          </div>
          
          {activeTab === 'SCENE' && (
            <div className="flex flex-col gap-1 mt-3">
               {activeBreakdown.managementAdjustment !== 0 && (
                <div className="text-xs text-yellow-500 font-medium bg-yellow-900/10 py-1 px-2 rounded-full inline-block mx-auto border border-yellow-900/30">
                   Mgmt Discount (-5%)
                </div>
              )}
              {activeBreakdown.reelDiscount !== 0 && (
                <div className="text-xs text-yellow-500 font-medium bg-yellow-900/10 py-1 px-2 rounded-full inline-block mx-auto border border-yellow-900/30">
                   Reel Discount (-5%)
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- SCENE VIEW CONTENT --- */}
        {activeTab === 'SCENE' && (
          <>
            {/* Mini Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800/30 p-3 rounded-lg border border-neutral-800 flex flex-col items-center">
                <Clock size={16} className="text-neutral-500 mb-1" />
                <span className="text-neutral-500 text-xs">Duration</span>
                <span className="text-neutral-200 font-semibold">{activeScene.data.duration}s</span>
              </div>
              <div className="bg-neutral-800/30 p-3 rounded-lg border border-neutral-800 flex flex-col items-center">
                 <Layers size={16} className="text-neutral-500 mb-1" />
                <span className="text-neutral-500 text-xs">Avg Cost/Sec</span>
                <span className="text-neutral-200 font-semibold">{formatMoney(costPerSecond, currencySymbol)}</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 w-full relative">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatMoney(value, currencySymbol)}
                      contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#f5f5f5', borderRadius: '8px' }}
                      itemStyle={{ color: '#f5f5f5' }}
                    />
                    <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                 <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                    Add duration/options
                 </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <DollarSign className="text-neutral-700 opacity-20 w-16 h-16" />
              </div>
            </div>

            {/* Detailed Breakdown List */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-3">Itemized Breakdown</h3>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-2 scrollbar-thin">
                {chartData.map((item) => (
                  <div key={item.name} className="flex justify-between items-center text-sm py-1 border-b border-neutral-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-neutral-300">{item.name}</span>
                    </div>
                    <span className="text-neutral-100 font-medium">{formatMoney(item.value, currencySymbol)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* --- TOTAL VIEW CONTENT --- */}
        {activeTab === 'TOTAL' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase">Scene List ({allScenes.length})</h3>
            <div className="max-h-96 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
              {projectSummary.sceneSummaries.map((scene) => (
                <div key={scene.id} className="flex flex-col p-3 bg-neutral-800/30 border border-neutral-800 rounded-lg">
                   <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-white">{scene.name}</span>
                      <span className="font-bold text-neutral-200">{formatMoney(scene.total, currencySymbol)}</span>
                   </div>
                   <div className="text-xs text-neutral-500">
                     Duration: {scene.duration}s
                   </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center">
                <span className="text-sm text-neutral-400">Total Scenes</span>
                <span className="text-white font-medium">{allScenes.length}</span>
            </div>
          </div>
        )}
        
        {/* Export & Disclaimer */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <button 
            onClick={handleExportPDF}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-lg transition-colors border border-neutral-700 group"
          >
            <FileDown size={18} className="text-red-500 group-hover:text-red-400 transition-colors" />
            {activeTab === 'SCENE' ? 'Export Scene Invoice' : 'Export Project Summary'}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onImportProject}
              className="flex items-center justify-center gap-2 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white py-2 rounded-lg border border-neutral-800 transition-colors"
            >
              <Upload size={14} /> Import JSON
            </button>
            <button 
              onClick={onExportProject}
              className="flex items-center justify-center gap-2 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white py-2 rounded-lg border border-neutral-800 transition-colors"
            >
              <Download size={14} /> Export JSON
            </button>
          </div>

          <div className="mt-4 flex gap-2 items-start bg-neutral-950 p-3 rounded-lg border border-neutral-800">
            <AlertCircle size={14} className="text-neutral-500 mt-0.5 shrink-0" />
            <div className="text-[10px] text-neutral-500 leading-tight">
              <p className="font-semibold text-neutral-400 mb-1">Estimate Notice</p>
              This is an automated estimate. Final costs may vary. 
              <br/>Contact Studio: <span className="text-neutral-300">+959792717361</span>
              <br/>Email: <span className="text-neutral-300">yannyeinhtet@gmail.com</span>
              <br/>Website: <span className="text-neutral-300">www.kaung.cc</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
