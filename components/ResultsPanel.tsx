
import React, { useMemo } from 'react';
import { CostBreakdown } from '../types';
import { COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, Activity, Layers, Clock, FileDown, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';

interface ResultsPanelProps {
  breakdown: CostBreakdown;
  currencySymbol?: string;
  duration: number;
}

const formatMoney = (amount: number, symbol = 'MMK') => {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${symbol}`;
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ breakdown, currencySymbol = 'MMK', duration }) => {
  
  const chartData = useMemo(() => {
    return [
      { name: 'Base Cost', value: breakdown.baseCost, color: COLORS.base },
      { name: 'Resolution & FPS', value: breakdown.resolutionCost + breakdown.fpsCost, color: COLORS.resolution },
      { name: 'Prep / Roto', value: breakdown.rotoCost + breakdown.cleanupCost + breakdown.keyingCost, color: COLORS.roto },
      { name: 'Tracking', value: breakdown.trackingCost, color: COLORS.tracking },
      { name: 'Assets', value: breakdown.assetCost, color: COLORS.assets },
      { name: 'Animation', value: breakdown.animationCost, color: COLORS.animation },
      { name: 'FX/Sim', value: breakdown.simulationCost, color: COLORS.simulation },
      { name: 'Compositing', value: breakdown.compositingCost + breakdown.layerAnimCost, color: COLORS.compositing },
      { name: 'Extras (Rush/Brief)', value: breakdown.urgentCost + breakdown.briefCost, color: COLORS.extras },
    ].filter(item => item.value > 0);
  }, [breakdown]);

  const costPerSecond = duration > 0 ? breakdown.total / duration : 0;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Red color
    doc.text("Chicken can't fly studio", margin, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80); // Gray
    doc.text("VFX Production Estimate", margin, yPos);
    
    // --- Contact Info ---
    yPos += 15;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Contact:", margin, yPos);
    doc.text("+959792717361", pageWidth - margin, yPos, { align: 'right' });
    yPos += 6;
    doc.text("yannyeinhtet@gmail.com", pageWidth - margin, yPos, { align: 'right' });
    yPos += 6;
    doc.text("www.kaung.cc", pageWidth - margin, yPos, { align: 'right' });
    doc.text("Date: " + new Date().toLocaleDateString(), margin, yPos);

    // --- Divider ---
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // --- Table Header ---
    doc.setFont("helvetica", "bold");
    doc.text("Description", margin, yPos);
    doc.text("Amount (MMK)", pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;
    doc.setFont("helvetica", "normal");

    // --- Table Rows ---
    const addRow = (label: string, value: number) => {
      if (value !== 0) {
        doc.text(label, margin, yPos);
        doc.text(value.toLocaleString(), pageWidth - margin, yPos, { align: 'right' });
        yPos += 7;
      }
    };

    addRow("Base Cost (Duration: " + duration + "s)", breakdown.baseCost);
    addRow("Resolution & FPS Surcharge", breakdown.resolutionCost + breakdown.fpsCost);
    addRow("Prep (Roto, Paint, Keying)", breakdown.rotoCost + breakdown.cleanupCost + breakdown.keyingCost);
    addRow("Tracking (Camera, Object, Matchmove)", breakdown.trackingCost);
    addRow("Assets (Models, Rigs, Env)", breakdown.assetCost);
    addRow("Animation & Mocap", breakdown.animationCost);
    addRow("Simulation / FX", breakdown.simulationCost);
    addRow("Compositing", breakdown.compositingCost + breakdown.layerAnimCost);
    addRow("Urgent Delivery Fee", breakdown.urgentCost);
    addRow("Creative Brief Surcharge", breakdown.briefCost);

    // --- Discounts ---
    if (breakdown.managementAdjustment !== 0) {
      doc.setTextColor(220, 160, 0); // Yellow/Orange
      addRow("Management Discount", breakdown.managementAdjustment);
      doc.setTextColor(0, 0, 0);
    }
    if (breakdown.reelDiscount !== 0) {
      doc.setTextColor(220, 160, 0);
      addRow("Reel Usage Discount", breakdown.reelDiscount);
      doc.setTextColor(0, 0, 0);
    }

    // --- Total ---
    yPos += 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Estimated Cost", margin, yPos);
    doc.setTextColor(220, 38, 38);
    doc.text(breakdown.total.toLocaleString() + " MMK", pageWidth - margin, yPos, { align: 'right' });
    
    // --- Footer / Notice ---
    yPos += 30;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("NOTICE: This document is an automated cost estimate and does not constitute a final binding contract.", margin, yPos);
    yPos += 5;
    doc.text("For a detailed breakdown and final quote, please contact the studio directly.", margin, yPos);
    
    // Save
    doc.save("VFX_Estimate_ChickenCantFly.pdf");
  };

  return (
    <div className="bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800 sticky top-6">
      <div className="p-6 bg-gradient-to-r from-neutral-900 to-black border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="text-red-500" />
          Estimate Summary
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Total */}
        <div className="text-center p-6 bg-black rounded-2xl border border-neutral-800 shadow-inner">
          <p className="text-neutral-500 text-sm uppercase tracking-widest mb-1">Total Estimated Cost</p>
          <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
            {formatMoney(breakdown.total, currencySymbol)}
          </div>
          
          <div className="flex flex-col gap-1 mt-3">
             {breakdown.managementAdjustment !== 0 && (
              <div className="text-xs text-yellow-500 font-medium bg-yellow-900/10 py-1 px-2 rounded-full inline-block mx-auto border border-yellow-900/30">
                 Management Discount (-5%)
              </div>
            )}
            {breakdown.reelDiscount !== 0 && (
              <div className="text-xs text-yellow-500 font-medium bg-yellow-900/10 py-1 px-2 rounded-full inline-block mx-auto border border-yellow-900/30">
                 Reel Usage Discount (-5%)
              </div>
            )}
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-800/30 p-3 rounded-lg border border-neutral-800 flex flex-col items-center">
            <Clock size={16} className="text-neutral-500 mb-1" />
            <span className="text-neutral-500 text-xs">Duration</span>
            <span className="text-neutral-200 font-semibold">{duration}s</span>
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
                Add duration to see breakdown
             </div>
          )}
          {/* Center Text in Donut */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <DollarSign className="text-neutral-700 opacity-20 w-16 h-16" />
          </div>
        </div>

        {/* Detailed Breakdown */}
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

          {(breakdown.managementAdjustment !== 0 || breakdown.reelDiscount !== 0) && (
            <div className="pt-2 mt-2 border-t border-neutral-800">
               {breakdown.managementAdjustment !== 0 && (
                 <div className="flex justify-between items-center text-sm py-1">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-yellow-500" />
                     <span className="text-yellow-500">Mgmt Discount</span>
                   </div>
                   <span className="text-yellow-500 font-medium">{formatMoney(breakdown.managementAdjustment, currencySymbol)}</span>
                 </div>
               )}
               {breakdown.reelDiscount !== 0 && (
                 <div className="flex justify-between items-center text-sm py-1">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-yellow-500" />
                     <span className="text-yellow-500">Reel Discount</span>
                   </div>
                   <span className="text-yellow-500 font-medium">{formatMoney(breakdown.reelDiscount, currencySymbol)}</span>
                 </div>
               )}
            </div>
          )}
        </div>
        
        {/* Export Button & Disclaimer */}
        <div className="pt-4 border-t border-neutral-800">
          <button 
            onClick={handleExportPDF}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-lg transition-colors border border-neutral-700 group"
          >
            <FileDown size={18} className="text-red-500 group-hover:text-red-400 transition-colors" />
            Export Invoice (PDF)
          </button>
          
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
