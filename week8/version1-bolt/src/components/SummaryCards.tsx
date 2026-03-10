import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle } from 'lucide-react';

interface SummaryCardsProps {
  totalRequests: number;
  pendingApprovals: number;
  approvedLeaves: number;
}

export function SummaryCards({ totalRequests, pendingApprovals, approvedLeaves }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Requests',
      value: totalRequests,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Approved Leaves',
      value: approvedLeaves,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${card.iconColor}`} />
                </div>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${card.color}`} />
          </motion.div>
        );
      })}
    </div>
  );
}
