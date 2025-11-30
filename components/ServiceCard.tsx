import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { ServiceJob } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

interface ServiceCardProps {
  service: ServiceJob;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const Icon = CATEGORY_ICONS[service.category];
  const colorClass = CATEGORY_COLORS[service.category] || "bg-gray-100 text-gray-700";

  return (
    <Link to={`/service/${service.id}`} className="block">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.99] mb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1 text-base">{service.title}</h3>
              <p className="text-xs text-gray-500 font-medium">{service.provider_name}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center text-gray-500 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1 text-primary" />
            {service.distance !== undefined ? (
              <span>{service.distance} km de você</span>
            ) : (
              <span>Localização desconhecida</span>
            )}
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-400">R$</span>
                <span className="font-extrabold text-gray-900 text-lg">
                  {service.price}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  /{service.price_unit === 'hour' ? 'h' : 'job'}
                </span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;