import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail } from 'lucide-react';

const ClienteStep = ({ formData, errors, updateFormData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Información del Cliente</h3>
        <p className="text-slate-600">Ingresa los datos del cliente para la cita</p>
      </div>

      <div className="space-y-4">
        {/* Nombre del Cliente */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nombre Completo *
          </label>
          <input
            type="text"
            value={formData.cliente}
            onChange={(e) => updateFormData('cliente', e.target.value)}
            placeholder="Ej: Juan Pérez"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.cliente ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.cliente && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.cliente}
            </motion.p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Teléfono *
          </label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => updateFormData('telefono', e.target.value)}
            placeholder="Ej: +57 300 123 4567"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.telefono ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.telefono && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.telefono}
            </motion.p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Correo Electrónico *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Ej: juan.perez@email.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.email}
            </motion.p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Nota:</strong> Todos los campos marcados con (*) son obligatorios para continuar al siguiente paso.
        </p>
      </div>
    </motion.div>
  );
};

export default ClienteStep;