import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const {
        subjects, notes, events, loading,
        fetchSubjects, createSubject, updateSubject, deleteSubject,
        fetchNotes, createNote, updateNote, deleteNote,
        createEvent, updateEvent, deleteEvent
    } = useStudy();

    const [view, setView] = useState('subjects'); // 'subjects' | 'notes' | 'events'
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' | 'view' | 'edit'

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState('calendar'); // 'calendar' | 'list'

    // Form states
    const [subjectForm, setSubjectForm] = useState({ name: '', description: '', professor: '', color: '#ec4899', icon: '📚' });
    const [noteForm, setNoteForm] = useState({ title: '', content: '', tags: '', date: '' });
    const [eventForm, setEventForm] = useState({ title: '', date: '', type: 'Examen', subject: '', description: '' });

    // Editing states
    const [viewingNote, setViewingNote] = useState(null);
    const [editingId, setEditingId] = useState(null); // ID of subject or event being edited

    // Notification logic
    const [hasNotification, setHasNotification] = useState(false);

    useEffect(() => {
        if (selectedSubject) {
            fetchNotes(selectedSubject._id);
        }
    }, [selectedSubject]);

    useEffect(() => {
        const checkNotifications = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const upcoming = events.some(event => {
                const eventDate = new Date(event.date);
                return (
                    eventDate.toLocaleDateString() === now.toLocaleDateString() ||
                    eventDate.toLocaleDateString() === tomorrow.toLocaleDateString()
                );
            });
            setHasNotification(upcoming);
        };

        if (events.length > 0) {
            checkNotifications();
        }
    }, [events]);

    // Calendar Logic
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const getEventsForDay = (date) => {
        if (!date) return [];
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
        });
    };

    // --- HANDLERS ---

    // SUBJECTS
    const handleCreateSubject = async (e) => {
        e.preventDefault();
        const result = await createSubject(subjectForm);
        if (result.success) {
            setShowModal(false);
            setSubjectForm({ name: '', description: '', professor: '', color: '#ec4899', icon: '📚' });
        } else {
            alert(result.error);
        }
    };

    const handleUpdateSubject = async (e) => {
        e.preventDefault();
        const result = await updateSubject(editingId, subjectForm);
        if (result.success) {
            setShowModal(false);
            setEditingId(null);
            setSubjectForm({ name: '', description: '', professor: '', color: '#ec4899', icon: '📚' });
        } else {
            alert(result.error);
        }
    };

    // NOTES
    const handleCreateNote = async (e) => {
        e.preventDefault();
        const tagsArray = noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        const result = await createNote({
            ...noteForm,
            tags: tagsArray,
            subject: selectedSubject._id,
            createdAt: noteForm.date ? new Date(noteForm.date) : new Date()
        });
        if (result.success) {
            setShowModal(false);
            setNoteForm({ title: '', content: '', tags: '', date: '' });
        } else {
            alert(result.error);
        }
    };

    const handleUpdateNote = async (e) => {
        e.preventDefault();
        const tagsArray = typeof noteForm.tags === 'string'
            ? noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            : noteForm.tags;

        const result = await updateNote(viewingNote._id, {
            ...noteForm,
            tags: tagsArray,
            createdAt: noteForm.date ? new Date(noteForm.date) : viewingNote.createdAt
        });

        if (result.success) {
            setViewingNote({
                ...viewingNote,
                ...noteForm,
                tags: tagsArray,
                createdAt: noteForm.date ? new Date(noteForm.date) : viewingNote.createdAt
            });
            setModalType('view');
        } else {
            alert(result.error);
        }
    };

    // EVENTS
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const result = await createEvent(eventForm);
        if (result.success) {
            setShowModal(false);
            setEventForm({ title: '', date: '', type: 'Examen', subject: '', description: '' });
        } else {
            alert(result.error);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        const result = await updateEvent(editingId, eventForm);
        if (result.success) {
            setShowModal(false);
            setEditingId(null);
            setEventForm({ title: '', date: '', type: 'Examen', subject: '', description: '' });
        } else {
            alert(result.error);
        }
    };

    // --- ACTIONS ---

    const openSubject = (subject) => {
        setSelectedSubject(subject);
        setView('notes');
    };

    const openNote = (note) => {
        setViewingNote(note);
        setNoteForm({
            title: note.title,
            content: note.content,
            tags: note.tags.join(', '),
            date: new Date(note.createdAt).toISOString().split('T')[0]
        });
        setModalType('view');
        setShowModal(true);
    };

    const startEditingNote = () => {
        setModalType('edit');
    };

    const startEditingSubject = (e, subject) => {
        e.stopPropagation();
        setEditingId(subject._id);
        setSubjectForm({
            name: subject.name,
            description: subject.description || '',
            professor: subject.professor || '',
            color: subject.color,
            icon: subject.icon
        });
        setModalType('edit');
        setShowModal(true);
    };

    const startEditingEvent = (e, event) => {
        e.stopPropagation();
        setEditingId(event._id);
        setEventForm({
            title: event.title,
            date: new Date(event.date).toISOString().split('T')[0],
            type: event.type,
            subject: event.subject ? event.subject._id : '',
            description: event.description || ''
        });
        setModalType('edit');
        setShowModal(true);
    };

    const goBack = () => {
        setSelectedSubject(null);
        setView('subjects');
    };

    const handleDeleteSubject = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('¿Eliminar esta materia y todos sus apuntes?')) {
            await deleteSubject(id);
        }
    };

    const handleDeleteNote = async (id) => {
        if (window.confirm('¿Eliminar este apunte?')) {
            await deleteNote(id);
            if (viewingNote && viewingNote._id === id) {
                setShowModal(false);
                setViewingNote(null);
            }
        }
    };

    const handleDeleteEvent = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('¿Eliminar este evento?')) {
            await deleteEvent(id);
        }
    };

    const openCreateModal = (prefilledDate = null) => {
        setModalType('create');
        setEditingId(null);
        if (view === 'events') {
            const dateToUse = prefilledDate
                ? prefilledDate.toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
            setEventForm({ title: '', date: dateToUse, type: 'Examen', subject: '', description: '' });
        } else if (view === 'subjects') {
            setSubjectForm({ name: '', description: '', professor: '', color: '#ec4899', icon: '📚' });
        } else {
            setNoteForm({ title: '', content: '', tags: '', date: new Date().toISOString().split('T')[0] });
        }
        setShowModal(true);
    };

    return (
        <div className="dashboard-page">
            <nav className="navbar glass">
                <div className="navbar-content container">
                    <div className="navbar-brand" onClick={() => setView('subjects')} style={{ cursor: 'pointer' }}>
                        <span className="brand-emoji">📝</span>
                        <span className="brand-text gradient-text">Mi Estudio</span>
                    </div>

                    <div className="navbar-actions">
                        <button
                            className={`btn-icon-nav ${view === 'events' ? 'active' : ''}`}
                            onClick={() => setView('events')}
                            title="Eventos"
                        >
                            📅
                            {hasNotification && <span className="notification-dot"></span>}
                        </button>

                        <div className="user-menu">
                            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt={user?.name} className="user-avatar" />
                            <span className="user-name">{user?.name}</span>
                        </div>
                        <button onClick={logout} className="btn btn-secondary btn-logout">
                            Salir
                        </button>
                    </div>
                </div>
            </nav>

            <main className="dashboard-content">
                <div className="container">

                    {/* HEADER */}
                    <header className="dashboard-header fade-in">
                        <div>
                            {view === 'notes' ? (
                                <button onClick={goBack} className="btn-back">
                                    ← Volver a Materias
                                </button>
                            ) : view === 'events' ? (
                                <>
                                    <h1 className="dashboard-title">
                                        Calendario <span className="gradient-text">Académico</span> 🗓️
                                    </h1>
                                    <p className="dashboard-subtitle">Organiza tus fechas importantes</p>
                                </>
                            ) : (
                                <>
                                    <h1 className="dashboard-title">
                                        Hola, <span className="gradient-text">{user?.name}</span> 👋
                                    </h1>
                                    <p className="dashboard-subtitle">Organiza tus materias y apuntes</p>
                                </>
                            )}
                        </div>

                        <div className="header-actions">
                            {view === 'events' && (
                                <div className="view-toggle">
                                    <button
                                        className={`btn-toggle ${calendarView === 'calendar' ? 'active' : ''}`}
                                        onClick={() => setCalendarView('calendar')}
                                    >
                                        Mes
                                    </button>
                                    <button
                                        className={`btn-toggle ${calendarView === 'list' ? 'active' : ''}`}
                                        onClick={() => setCalendarView('list')}
                                    >
                                        Lista
                                    </button>
                                </div>
                            )}
                            <button className="btn btn-primary" onClick={() => openCreateModal()}>
                                {view === 'subjects' ? '➕ Nueva Materia' : view === 'events' ? '➕ Nuevo Evento' : '➕ Nuevo Apunte'}
                            </button>
                        </div>
                    </header>

                    {/* CONTENT */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-large"></div>
                            <p>Cargando...</p>
                        </div>
                    ) : (
                        <>
                            {/* VISTA DE MATERIAS */}
                            {view === 'subjects' && (
                                <div className="subjects-grid fade-in">
                                    {subjects.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-icon">📚</div>
                                            <h2>No tienes materias aún</h2>
                                            <p>Crea tu primera materia para empezar a estudiar</p>
                                        </div>
                                    ) : (
                                        subjects.map(subject => (
                                            <div
                                                key={subject._id}
                                                className="subject-card card"
                                                style={{ borderLeft: `6px solid ${subject.color}` }}
                                                onClick={() => openSubject(subject)}
                                            >
                                                <div className="subject-icon" style={{ background: subject.color + '20' }}>
                                                    {subject.icon}
                                                </div>
                                                <div className="subject-info">
                                                    <h3>{subject.name}</h3>
                                                    {subject.professor && (
                                                        <p className="professor-name">👨‍🏫 {subject.professor}</p>
                                                    )}
                                                    <p>{subject.description || 'Sin descripción'}</p>
                                                </div>
                                                <div className="card-actions">
                                                    <button
                                                        className="btn-icon-small"
                                                        onClick={(e) => startEditingSubject(e, subject)}
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn-icon-small delete"
                                                        onClick={(e) => handleDeleteSubject(e, subject._id)}
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* VISTA DE EVENTOS */}
                            {view === 'events' && (
                                <div className="events-container fade-in">

                                    {calendarView === 'calendar' ? (
                                        <div className="calendar-wrapper card">
                                            <div className="calendar-header">
                                                <button onClick={() => changeMonth(-1)} className="btn-icon">◀</button>
                                                <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                                                <button onClick={() => changeMonth(1)} className="btn-icon">▶</button>
                                            </div>

                                            <div className="calendar-grid">
                                                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                                    <div key={day} className="calendar-day-header">{day}</div>
                                                ))}

                                                {getDaysInMonth(currentDate).map((day, index) => {
                                                    const dayEvents = getEventsForDay(day);
                                                    const isToday = day && day.toDateString() === new Date().toDateString();

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''}`}
                                                            onClick={() => day && openCreateModal(day)}
                                                        >
                                                            {day && (
                                                                <>
                                                                    <span className="day-number">{day.getDate()}</span>
                                                                    <div className="day-events">
                                                                        {dayEvents.map(ev => (
                                                                            <div
                                                                                key={ev._id}
                                                                                className={`event-dot type-${ev.type.toLowerCase()}`}
                                                                                title={`${ev.title} (${ev.type})`}
                                                                                onClick={(e) => startEditingEvent(e, ev)}
                                                                            >
                                                                                {ev.title}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        // VISTA DE LISTA
                                        <div className="events-list">
                                            {events.length === 0 ? (
                                                <div className="empty-state">
                                                    <div className="empty-icon">🎉</div>
                                                    <h2>No hay eventos próximos</h2>
                                                    <p>¡Disfruta tu tiempo libre!</p>
                                                </div>
                                            ) : (
                                                events.map(event => (
                                                    <div key={event._id} className="event-card card">
                                                        <div className="event-date-box">
                                                            <span className="event-day">{new Date(event.date).getDate()}</span>
                                                            <span className="event-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                        </div>
                                                        <div className="event-info">
                                                            <div className="event-header">
                                                                <h3>{event.title}</h3>
                                                                <span className={`event-type type-${event.type.toLowerCase()}`}>{event.type}</span>
                                                            </div>
                                                            {event.subject && (
                                                                <p className="event-subject" style={{ color: event.subject.color }}>
                                                                    📚 {event.subject.name}
                                                                </p>
                                                            )}
                                                            <p className="event-desc">{event.description}</p>
                                                        </div>
                                                        <div className="card-actions-vertical">
                                                            <button className="btn-icon-small" onClick={(e) => startEditingEvent(e, event)}>✏️</button>
                                                            <button className="btn-icon-small delete" onClick={(e) => handleDeleteEvent(e, event._id)}>🗑️</button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* VISTA DE APUNTES */}
                            {view === 'notes' && selectedSubject && (
                                <div className="notes-view fade-in">
                                    <div className="subject-header-detail">
                                        <h2 style={{ color: selectedSubject.color }}>
                                            {selectedSubject.icon} {selectedSubject.name}
                                        </h2>
                                        {selectedSubject.professor && (
                                            <p className="professor-detail">Profesor: {selectedSubject.professor}</p>
                                        )}
                                        <p>{selectedSubject.description}</p>
                                    </div>

                                    <div className="notes-grid">
                                        {notes.length === 0 ? (
                                            <div className="empty-state-notes">
                                                <p>No hay apuntes en esta materia.</p>
                                                <button onClick={() => openCreateModal()}>Crear el primero ✍️</button>
                                            </div>
                                        ) : (
                                            notes.map(note => (
                                                <div key={note._id} className="note-card card" onClick={() => openNote(note)}>
                                                    <div className="note-header">
                                                        <h3>{note.title}</h3>
                                                    </div>
                                                    <div className="note-preview">
                                                        {note.content}
                                                    </div>
                                                    <div className="note-footer">
                                                        <div className="note-tags">
                                                            {note.tags.slice(0, 3).map((tag, i) => (
                                                                <span key={i} className="tag">#{tag}</span>
                                                            ))}
                                                            {note.tags.length > 3 && <span className="tag">+{note.tags.length - 3}</span>}
                                                        </div>
                                                        <span className="note-date">
                                                            {new Date(note.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className={`modal-content ${modalType === 'view' ? 'modal-large' : ''}`} onClick={e => e.stopPropagation()}>

                        <div className="modal-header">
                            <h2>
                                {modalType === 'create' && view === 'subjects' && 'Nueva Materia'}
                                {modalType === 'edit' && view === 'subjects' && 'Editar Materia'}

                                {modalType === 'create' && view === 'events' && 'Nuevo Evento'}
                                {modalType === 'edit' && view === 'events' && 'Editar Evento'}

                                {modalType === 'create' && view === 'notes' && 'Nuevo Apunte'}
                                {modalType === 'view' && viewingNote?.title}
                                {modalType === 'edit' && view === 'notes' && 'Editar Apunte'}
                            </h2>
                            <div className="modal-actions">
                                {modalType === 'view' && (
                                    <>
                                        <button className="btn-icon" onClick={startEditingNote} title="Editar">✏️</button>
                                        <button className="btn-icon" onClick={() => handleDeleteNote(viewingNote._id)} title="Eliminar">🗑️</button>
                                    </>
                                )}
                                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                            </div>
                        </div>

                        <div className="form-content">
                            {/* NOTE READER */}
                            {modalType === 'view' && viewingNote && (
                                <div className="note-reader">
                                    <div className="note-reader-header-meta">
                                        <span className="note-date-badge">
                                            📅 {new Date(viewingNote.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="note-reader-content">
                                        {viewingNote.content}
                                    </div>
                                    <div className="note-reader-tags">
                                        {viewingNote.tags.map((tag, i) => (
                                            <span key={i} className="tag-large">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FORMS */}
                            {(modalType === 'create' || modalType === 'edit') && (
                                <form onSubmit={
                                    view === 'subjects'
                                        ? (modalType === 'edit' ? handleUpdateSubject : handleCreateSubject)
                                        : view === 'events'
                                            ? (modalType === 'edit' ? handleUpdateEvent : handleCreateEvent)
                                            : (modalType === 'edit' ? handleUpdateNote : handleCreateNote)
                                }>

                                    {/* SUBJECT FORM */}
                                    {view === 'subjects' && (
                                        <>
                                            <div className="form-group">
                                                <label>Nombre de la Materia</label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Ej: Matemáticas"
                                                    value={subjectForm.name}
                                                    onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Profesor</label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Ej: Dr. García"
                                                    value={subjectForm.professor}
                                                    onChange={e => setSubjectForm({ ...subjectForm, professor: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Descripción</label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Breve descripción..."
                                                    value={subjectForm.description}
                                                    onChange={e => setSubjectForm({ ...subjectForm, description: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Color</label>
                                                    <input
                                                        type="color"
                                                        className="input input-color"
                                                        value={subjectForm.color}
                                                        onChange={e => setSubjectForm({ ...subjectForm, color: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Icono</label>
                                                    <select
                                                        className="input"
                                                        value={subjectForm.icon}
                                                        onChange={e => setSubjectForm({ ...subjectForm, icon: e.target.value })}
                                                    >
                                                        <option>📚</option>
                                                        <option>📐</option>
                                                        <option>🧪</option>
                                                        <option>💻</option>
                                                        <option>🎨</option>
                                                        <option>🌍</option>
                                                        <option>🧬</option>
                                                        <option>🎵</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* EVENT FORM */}
                                    {view === 'events' && (
                                        <>
                                            <div className="form-group">
                                                <label>Título del Evento</label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Ej: Examen Parcial"
                                                    value={eventForm.title}
                                                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Fecha</label>
                                                    <input
                                                        type="date"
                                                        className="input"
                                                        value={eventForm.date}
                                                        onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Tipo</label>
                                                    <select
                                                        className="input"
                                                        value={eventForm.type}
                                                        onChange={e => setEventForm({ ...eventForm, type: e.target.value })}
                                                    >
                                                        <option>Examen</option>
                                                        <option>Exposición</option>
                                                        <option>Tarea</option>
                                                        <option>Proyecto</option>
                                                        <option>Otro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Materia (Opcional)</label>
                                                <select
                                                    className="input"
                                                    value={eventForm.subject}
                                                    onChange={e => setEventForm({ ...eventForm, subject: e.target.value })}
                                                >
                                                    <option value="">-- Ninguna --</option>
                                                    {subjects.map(s => (
                                                        <option key={s._id} value={s._id}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Descripción</label>
                                                <textarea
                                                    className="input textarea"
                                                    placeholder="Detalles adicionales..."
                                                    value={eventForm.description}
                                                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </>
                                    )}

                                    {/* NOTE FORM */}
                                    {view === 'notes' && (
                                        <>
                                            <div className="form-group">
                                                <label>Título del Apunte</label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Ej: Teorema de Pitágoras"
                                                    value={noteForm.title}
                                                    onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha</label>
                                                <input
                                                    type="date"
                                                    className="input"
                                                    value={noteForm.date}
                                                    onChange={e => setNoteForm({ ...noteForm, date: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Contenido</label>
                                                <textarea
                                                    className="input textarea-large"
                                                    placeholder="Escribe tus apuntes aquí..."
                                                    value={noteForm.content}
                                                    onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label>Etiquetas (separadas por coma)</label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Ej: examen, importante, formula"
                                                    value={noteForm.tags}
                                                    onChange={e => setNoteForm({ ...noteForm, tags: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">
                                            {modalType === 'edit' ? 'Actualizar' : 'Guardar'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
