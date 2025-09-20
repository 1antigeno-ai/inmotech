import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const FechaHoraStep = ({ formData, errors, updateFormData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formData.fecha);
  const [availableHours] = useState([
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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
      
      days.push({
        date,
        isCurrentMonth: true,
        isDisabled: date < today,
        isToday: date.toDateString() === today.toDateString()
      });
    }

    // Días del mes siguiente para completar la grilla
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

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDateSelect = (day) => {
    if (day.isDisabled) return;
    
    const dateString = formatDateForInput(day.date);
    setSelectedDate(dateString);
    updateFormData('fecha', dateString);
  };

  const handleHourSelect = (hour) => {
    updateFormData('hora', hour);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Fecha y Hora</h3>
        <p className="text-slate-600">Selecciona cuándo será la cita</p>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </motion.button>
          
          <h4 className="text-lg font-semibold text-slate-800">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
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
            const isSelected = selectedDate === formatDateForInput(day.date);
            
            return (
              <motion.button
                key={index}
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
                `}
              >
                {day.date.getDate()}
              </motion.button>
            );
          })}
        </div>

        {errors.fecha && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {errors.fecha}
          </motion.p>
        )}
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-5 h-5" />
            <h4 className="font-medium">Seleccionar Hora</h4>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {availableHours.map(hour => (
              <motion.button
                key={hour}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleHourSelect(hour)}
                className={`
                  py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${formData.hora === hour
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50'
                  }
                `}
              >
                {hour}
              </motion.button>
            ))}
          </div>

          {errors.hora && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm"
            >
              {errors.hora}
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Selected Date and Time Display */}
      {formData.fecha && formData.hora && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-green-800">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Cita programada para:</span>
          </div>
          <p className="text-green-700 mt-1 font-semibold">
            {formatDateForDisplay(formData.fecha)} a las {formData.hora}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FechaHoraStep;