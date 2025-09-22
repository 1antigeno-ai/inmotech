import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  CreditCard, 
  Hash, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  MessageSquare, 
  MapPin,
  Home,
  DollarSign,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PropertyVisitModal = ({ isOpen, onClose, property, onSubmit }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    tipoDocumento: 'cedula',
    numeroDocumento: '',
    telefono: '',
    email: '',
    fecha: '',
    hora: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const availableHours = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const tiposDocumento = [
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'tarjeta_identidad', label: 'Tarjeta de Identidad' }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isDisabled: true
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Deshabilitar domingos (día 0)
      const isDisabled = date < today || date.getDay() === 0;
      
      days.push({
        date,
        isCurrentMonth: true,
        isDisabled,
        isToday: date.toDateString() === today.toDateString(),
        isSunday: date.getDay() === 0
      });
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isDisabled: true
      });
    }

    return days;
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre completo es requerido';
    if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = 'El número de documento es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.hora) newErrors.hora = 'La hora es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const citaData = {
        cliente: formData.nombreCompleto,
        telefono: formData.telefono,
        email: formData.email,
        fecha: formData.fecha,
        hora: formData.hora,
        propiedad: property?.title || 'Propiedad no especificada',
        notas: `Tipo de documento: ${tiposDocumento.find(t => t.value === formData.tipoDocumento)?.label}, Número: ${formData.numeroDocumento}. ${formData.mensaje ? 'Mensaje: ' + formData.mensaje : ''}`,
        estado: 'programada',
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        mensaje: formData.mensaje
      };
      
      onSubmit(citaData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      nombreCompleto: '',
      tipoDocumento: 'cedula',
      numeroDocumento: '',
      telefono: '',
      email: '',
      fecha: '',
      hora: '',
      mensaje: ''
    });
    setErrors({});
    onClose();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateSelect = (day) => {
    if (day.isDisabled) return;
    
    const dateString = formatDateForInput(day.date);
    updateFormData('fecha', dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);

  if (!isOpen || !property) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Agendar Visita a la Propiedad</h2>
                <p className="text-slate-600 mt-1">Programa tu visita personalizada</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row max-h-[80vh] overflow-hidden">
            {/* Property Info Sidebar */}
            <div className="lg:w-1/3 bg-gradient-to-b from-slate-50 to-slate-100 p-6 border-r border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <Home className="w-5 h-5" />
                  <span>Propiedad seleccionada</span>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{property.title}</h3>
                  
                  <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-xl font-bold text-green-600">{property.price}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center bg-slate-50 rounded-lg p-2">
                      <div className="font-semibold text-slate-800">{property.area}</div>
                      <div className="text-slate-500">Área</div>
                    </div>
                    <div className="text-center bg-slate-50 rounded-lg p-2">
                      <div className="font-semibold text-slate-800">{property.bedrooms}</div>
                      <div className="text-slate-500">Hab.</div>
                    </div>
                    <div className="text-center bg-slate-50 rounded-lg p-2">
                      <div className="font-semibold text-slate-800">{property.bathrooms}</div>
                      <div className="text-slate-500">Baños</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:w-2/3 p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Información Personal
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.nombreCompleto}
                        onChange={(e) => updateFormData('nombreCompleto', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.nombreCompleto ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Ingresa tu nombre completo"
                      />
                      {errors.nombreCompleto && (
                        <p className="text-red-500 text-sm mt-1">{errors.nombreCompleto}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tipo de Documento *
                      </label>
                      <select
                        value={formData.tipoDocumento}
                        onChange={(e) => updateFormData('tipoDocumento', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        {tiposDocumento.map(tipo => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        value={formData.numeroDocumento}
                        onChange={(e) => updateFormData('numeroDocumento', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.numeroDocumento ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Número de documento"
                      />
                      {errors.numeroDocumento && (
                        <p className="text-red-500 text-sm mt-1">{errors.numeroDocumento}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => updateFormData('telefono', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.telefono ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="+57 300 123 4567"
                      />
                      {errors.telefono && (
                        <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Selecciona fecha y hora
                  </h3>

                  {/* Calendar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                      </motion.button>
                      
                      <h4 className="text-lg font-semibold text-slate-800">
                        {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h4>
                      
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      </motion.button>
                    </div>

                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((day, index) => {
                        const isSelected = formData.fecha === formatDateForInput(day.date);
                        
                        return (
                          <motion.button
                            key={index}
                            type="button"
                            whileHover={!day.isDisabled ? { scale: 1.05 } : {}}
                            whileTap={!day.isDisabled ? { scale: 0.95 } : {}}
                            onClick={() => handleDateSelect(day)}
                            disabled={day.isDisabled}
                            className={`
                              h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
                              ${day.isDisabled 
                                ? 'text-slate-300 cursor-not-allowed' 
                                : 'text-slate-700 hover:bg-blue-50'
                              }
                              ${!day.isCurrentMonth ? 'text-slate-400' : ''}
                              ${day.isToday ? 'bg-blue-100 text-blue-600 font-bold' : ''}
                              ${isSelected ? 'bg-blue-600 text-white' : ''}
                              ${day.isSunday && day.isCurrentMonth ? 'bg-red-50 text-red-400' : ''}
                            `}
                          >
                            {day.date.getDate()}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-600 rounded"></div>
                        <span>Seleccionado</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-100 rounded"></div>
                        <span>Hoy</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-50 rounded"></div>
                        <span>No disponible</span>
                      </div>
                    </div>

                    {errors.fecha && (
                      <p className="text-red-500 text-sm mt-2">{errors.fecha}</p>
                    )}
                  </div>

                  {/* Time Selection */}
                  {formData.fecha && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-5 h-5" />
                        <h4 className="font-medium">Horarios disponibles</h4>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {availableHours.map(hour => (
                          <motion.button
                            key={hour}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateFormData('hora', hour)}
                            className={`
                              py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                              ${formData.hora === hour
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                              }
                            `}
                          >
                            {hour}
                          </motion.button>
                        ))}
                      </div>

                      {errors.hora && (
                        <p className="text-red-500 text-sm">{errors.hora}</p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Mensaje Adicional
                  </label>
                  <textarea
                    value={formData.mensaje}
                    onChange={(e) => updateFormData('mensaje', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="¿Hay algo específico que te gustaría saber sobre la propiedad?"
                  />
                </div>

                {/* Important Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Información importante</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Te contactaremos en las próximas 2 horas para confirmar</li>
                        <li>• Duración aproximada: 30-45 minutos</li>
                        <li>• Puedes reagendar con 24 horas de anticipación</li>
                        <li>• Para visitas presenciales, lleva identificación</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
                  >
                    Agendar Visita
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PropertyVisitModal;