'use client';

import { motion } from 'framer-motion';

interface ItemCardProps {
  itemKey: string;
  item: any;
  index: number;
}

export default function ItemCard({ itemKey, item, index }: ItemCardProps) {
  return (
    <motion.div 
      key={itemKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="h-48 overflow-hidden bg-gray-100">
        {item.public_url && (
          <img 
            src={item.public_url}
            alt={item.estimated_name || 'Unknown item'}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.estimated_name || 'Unknown Item'}</h3>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Estimated Price:</span> ${item.estimated_price?.toLocaleString() || 'N/A'}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Confidence:</span> {Math.round((item.best_confidence || 0) * 100)}%
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Type:</span> {item.class}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
