import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../../shared/components/dashboard/Layout/DashboardLayout';
import SearchBar from '../../components/SearchBar';
import StatsCard from '../../components/StatsCard';
import CitasTable from '../../components/citas/CitasTable';
import CreateCitaModal from '../../components/citas/CreateCitaModal';
import ViewCitaModal from '../../components/citas/ViewCitaModal';
import EditCitaModal from '../../components/citas/EditCitaModal';
import DeleteConfirmModal from '../../../../shared/components/modals/DeleteConfirmModal';
import { useToast } from '../../../../shared/hooks/use-toast';

const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const { toast } = useToast();

  // Mock data - En producción esto vendría de una API
  useEffect(() => {
    const mockCitas = [
      {
        id: 1,
        cliente: 'Juan Pérez',
        telefono: '+57 300 123 4567',
        email: 'juan.perez@email.com',
        fecha: '2024-01-15',
        hora: '10:00',
        propiedad: 'Casa en El Poblado',
        estado: 'programada',
        notas: 'Cliente interesado en propiedades de lujo',
        fechaCreacion: '2024-01-10'
      },
      {
        id: 2,
        cliente: 'María González',
        telefono: '+57 301 234 5678',
        email: 'maria.gonzalez@email.com',
        fecha: '2024-01-16',
        hora: '14:30',
        propiedad: 'Apartamento en Laureles',
        estado: 'confirmada',
        notas: 'Primera visita, cliente muy interesado',
        fechaCreacion: '2024-01-11'
      },
      {
        id: 3,
        cliente: 'Carlos Rodríguez',
        telefono: '+57 302 345 6789',
        email: 'carlos.rodriguez@email.com',
        fecha: '2024-01-14',
        hora: '09:00',
        propiedad: 'Local Comercial Centro',
        estado: 'completada',
        notas: 'Visita exitosa, cliente decidió comprar',
        fechaCreacion: '2024-01-09'
      },
      {
        id: 4,
        cliente: 'Ana Martínez',
        telefono: '+57 303 456 7890',
        email: 'ana.martinez@email.com',
        fecha: '2024-01-13',
        hora: '16:00',
        propiedad: 'Casa Campestre',
        estado: 'cancelada',
        notas: 'Cliente canceló por motivos personales',
        fechaCreacion: '2024-01-08'
      }
    ];
    setCitas(mockCitas);
    setFilteredCitas(mockCitas);
  }, []);

  // Filtrar citas
  useEffect(() => {
    let filtered = citas;

    if (searchTerm) {
      filtered = filtered.filter(cita =>
        cita.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.propiedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(cita => cita.estado === statusFilter);
    }

    setFilteredCitas(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, citas]);

  // Calcular estadísticas
  const stats = {
    total: citas.length,
    programadas: citas.filter(c => c.estado === 'programada').length,
    confirmadas: citas.filter(c => c.estado === 'confirmada').length,
    canceladas: citas.filter(c => c.estado === 'cancelada').length,
    completadas: citas.filter(c => c.estado === 'completada').length
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCitas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCitas.length / itemsPerPage);

  const handleCreateCita = (newCita) => {
    const citaWithId = {
      ...newCita,
      id: Date.now(),
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setCitas(prev => [...prev, citaWithId]);
    setIsCreateModalOpen(false);
    toast({
      title: "¡Cita creada exitosamente!",
      description: "La cita ha sido agendada correctamente.",
      variant: "default"
    });
  };

  // Función para recibir citas desde el frontend público
  const handlePublicVisitSchedule = (visitData) => {
    const citaWithId = {
      ...visitData,
      id: Date.now(),
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setCitas(prev => [...prev, citaWithId]);
  };

  // En una aplicación real, esto se manejaría a través de un contexto global o estado compartido
  // Por ahora, las citas del frontend se agregan automáticamente cuando se crean

  const handleEditCita = (updatedCita) => {
    setCitas(prev => prev.map(cita => 
      cita.id === updatedCita.id ? updatedCita : cita
    ));
    setIsEditModalOpen(false);
    setSelectedCita(null);
    toast({
      title: "¡Cita actualizada exitosamente!",
      description: "Los cambios han sido guardados correctamente.",
      variant: "default"
    });
  };

  const handleDeleteCita = () => {
    setCitas(prev => prev.filter(cita => cita.id !== selectedCita.id));
    setIsDeleteModalOpen(false);
    setSelectedCita(null);
    toast({
      title: "¡Cita eliminada exitosamente!",
      description: "La cita ha sido eliminada del sistema.",
      variant: "default"
    });
  };

  const handleViewCita = (cita) => {
    setSelectedCita(cita);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (cita) => {
    setSelectedCita(cita);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (cita) => {
    setSelectedCita(cita);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Gestión de Citas</h1>
            <p className="text-slate-600 mt-1">Administra todas las citas de tus clientes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Nueva Cita
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <StatsCard
            title="Total Citas"
            value={stats.total}
            icon={Calendar}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            textColor="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatsCard
            title="Programadas"
            value={stats.programadas}
            icon={Clock}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            textColor="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatsCard
            title="Confirmadas"
            value={stats.confirmadas}
            icon={CheckCircle}
            color="bg-gradient-to-r from-green-500 to-green-600"
            textColor="text-green-600"
            bgColor="bg-green-50"
          />
          <StatsCard
            title="Canceladas"
            value={stats.canceladas}
            icon={XCircle}
            color="bg-gradient-to-r from-red-500 to-red-600"
            textColor="text-red-600"
            bgColor="bg-red-50"
          />
          <StatsCard
            title="Completadas"
            value={stats.completadas}
            icon={AlertCircle}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            textColor="text-purple-600"
            bgColor="bg-purple-50"
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Buscar por cliente, propiedad o email..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="programada">Programadas</option>
              <option value="confirmada">Confirmadas</option>
              <option value="cancelada">Canceladas</option>
              <option value="completada">Completadas</option>
            </select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CitasTable
            citas={currentItems}
            onView={handleViewCita}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </motion.div>

        {/* Modals */}
        <CreateCitaModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCita}
        />

        <ViewCitaModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          cita={selectedCita}
        />

        <EditCitaModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          cita={selectedCita}
          onSubmit={handleEditCita}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteCita}
          title="Eliminar Cita"
          message={`¿Estás seguro de que deseas eliminar la cita con ${selectedCita?.cliente}? Esta acción no se puede deshacer.`}
        />
      </div>
    </DashboardLayout>
  );
};

export default CitasPage;