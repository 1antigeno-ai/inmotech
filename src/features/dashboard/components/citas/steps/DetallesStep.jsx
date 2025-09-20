import React from 'react';
import { motion } from 'framer-motion';
import { Home, FileText } from 'lucide-react';

const DetallesStep = ({ formData, errors, updateFormData }) => {
  const propiedades = [
    'Casa en El Poblado - $850,000',
    'Apartamento en Laureles - $450,000',
    'Penthouse con Vista Panorámica - $1,200,000',
    'Casa Campestre - $750,000',
    'Apartamento Amoblado - $2,500/mes',
    'Local Comercial - $350,000',
    'Oficina Ejecutiva - $3,000/mes',
    'Casa Familiar - $520,000'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Detalles de la Cita</h3>
        <p className="text-slate-600">Información adicional sobre la cita</p>
      </div>

      <div className="space-y-6">
        {/* Propiedad */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Home className="w-4 h-4 inline mr-2" />
            Propiedad *
          </label>
          <select
            value={formData.propiedad}
            onChange={(e) => updateFormData('propiedad', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.propiedad ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Selecciona una propiedad</option>
            {propiedades.map((propiedad, index) => (
              <option key={index} value={propiedad}>
                {propiedad}
              </option>
            ))}
          </select>
          {errors.propiedad && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.propiedad}
            </motion.p>
          )}
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Notas Adicionales
          </label>
          <textarea
            value={formData.notas}
            onChange={(e) => updateFormData('notas', e.target.value)}
            placeholder="Información adicional sobre la cita, preferencias del cliente, etc."
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          />
          <p className="text-slate-500 text-sm mt-1">
            Opcional: Agrega cualquier información relevante para la cita
          </p>
        </div>

        {/* Estado de la Cita */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estado de la Cita
          </label>
          <select
            value={formData.estado}
            onChange={(e) => updateFormData('estado', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="programada">Programada</option>
            <option value="confirmada">Confirmada</option>
          </select>
          <p className="text-slate-500 text-sm mt-1">
            Por defecto se crea como "Programada"
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          <strong>Recordatorio:</strong> Asegúrate de que la propiedad seleccionada esté disponible para la fecha y hora elegidas.
        </p>
      </div>
    </motion.div>
  );
};

export default DetallesStep;