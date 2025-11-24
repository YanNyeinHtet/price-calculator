
import React, { useMemo } from 'react';
import { CostBreakdown } from '../types';
import { COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, Activity, Layers, Clock } from 'lucide-react';

interface ResultsPanelProps {
  breakdown: CostBreakdown;
  currencySymbol?: string;
  duration: number;
}

const formatMoney = (amount: number, symbol = '$') => {
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ breakdown, currencySymbol = '$', duration }) => {
  
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

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 sticky top-6">
      <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="text-cyan-400" />
          Estimate Summary
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Total */}
        <div className="text-center p-6 bg-slate-900 rounded-2xl border border-slate-700/50 shadow-inner">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Total Estimated Cost</p>
          <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            {formatMoney(breakdown.total, currencySymbol)}
          </div>
          
          <div className="flex flex-col gap-1 mt-3">
             {breakdown.managementAdjustment !== 0 && (
              <div className="text-xs text-emerald-400 font-medium bg-emerald-900/20 py-1 px-2 rounded-full inline-block mx-auto border border-emerald-900/50">
                 Management Discount (-5%)
              </div>
            )}
            {breakdown.reelDiscount !== 0 && (
              <div className="text-xs text-emerald-400 font-medium bg-emerald-900/20 py-1 px-2 rounded-full inline-block mx-auto border border-emerald-900/50">
                 Reel Usage Discount (-5%)
              </div>
            )}
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-700 flex flex-col items-center">
            <Clock size={16} className="text-slate-400 mb-1" />
            <span className="text-slate-400 text-xs">Duration</span>
            <span className="text-slate-200 font-semibold">{duration}s</span>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-700 flex flex-col items-center">
             <Layers size={16} className="text-slate-400 mb-1" />
            <span className="text-slate-400 text-xs">Avg Cost/Sec</span>
            <span className="text-slate-200 font-semibold">{formatMoney(costPerSecond, currencySymbol)}</span>
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
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
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
             <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                Add duration to see breakdown
             </div>
          )}
          {/* Center Text in Donut */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <DollarSign className="text-slate-600 opacity-20 w-16 h-16" />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Itemized Breakdown</h3>
          <div className="max-h-60 overflow-y-auto pr-2 space-y-2 scrollbar-thin">
            {chartData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-sm py-1 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-slate-100 font-medium">{formatMoney(item.value, currencySymbol)}</span>
              </div>
            ))}
          </div>

          {(breakdown.managementAdjustment !== 0 || breakdown.reelDiscount !== 0) && (
            <div className="pt-2 mt-2 border-t border-slate-700">
               {breakdown.managementAdjustment !== 0 && (
                 <div className="flex justify-between items-center text-sm py-1">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-emerald-400">Mgmt Discount</span>
                   </div>
                   <span className="text-emerald-400 font-medium">{formatMoney(breakdown.managementAdjustment, currencySymbol)}</span>
                 </div>
               )}
               {breakdown.reelDiscount !== 0 && (
                 <div className="flex justify-between items-center text-sm py-1">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-emerald-400">Reel Discount</span>
                   </div>
                   <span className="text-emerald-400 font-medium">{formatMoney(breakdown.reelDiscount, currencySymbol)}</span>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
