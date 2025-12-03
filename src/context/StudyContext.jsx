import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const StudyContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useStudy = () => {
    const context = useContext(StudyContext);
    if (!context) {
        throw new Error('useStudy debe ser usado dentro de un StudyProvider');
    }
    return context;
};

export const StudyProvider = ({ children }) => {
    const [subjects, setSubjects] = useState([]);
    const [notes, setNotes] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    // --- MATERIAS ---

    const fetchSubjects = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/subjects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setSubjects(data.subjects);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const createSubject = async (subjectData) => {
        try {
            const res = await fetch(`${API_URL}/subjects`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subjectData)
            });
            const data = await res.json();
            if (data.success) {
                setSubjects([data.subject, ...subjects]);
                return { success: true };
            }
            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Error al crear materia' };
        }
    };

    const updateSubject = async (id, subjectData) => {
        try {
            const res = await fetch(`${API_URL}/subjects/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subjectData)
            });
            const data = await res.json();
            if (data.success) {
                setSubjects(subjects.map(s => s._id === id ? data.subject : s));
                return { success: true };
            }
            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Error al actualizar materia' };
        }
    };

    const deleteSubject = async (id) => {
        try {
            const res = await fetch(`${API_URL}/subjects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSubjects(subjects.filter(s => s._id !== id));
                setNotes(notes.filter(n => n.subject._id !== id));
                return { success: true };
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    // --- APUNTES ---

    const fetchNotes = async (subjectId = null) => {
        if (!token) return;
        try {
            let url = `${API_URL}/notes`;
            if (subjectId) url += `?subject=${subjectId}`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setNotes(data.notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const createNote = async (noteData) => {
        try {
            const res = await fetch(`${API_URL}/notes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)
            });
            const data = await res.json();
            if (data.success) {
                setNotes([data.note, ...notes]);
                return { success: true };
            }
            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Error al crear apunte' };
        }
    };

    const updateNote = async (id, noteData) => {
        try {
            const res = await fetch(`${API_URL}/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)
            });
            const data = await res.json();
            if (data.success) {
                setNotes(notes.map(n => n._id === id ? data.note : n));
                return { success: true };
            }
            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Error al actualizar apunte' };
        }
    };

    const deleteNote = async (id) => {
        try {
            const res = await fetch(`${API_URL}/notes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setNotes(notes.filter(n => n._id !== id));
                return { success: true };
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    // --- EVENTOS ---

    const fetchEvents = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setEvents(data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const createEvent = async (eventData) => {
        try {
            const res = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            const data = await res.json();
            if (data.success) {
                setEvents([...events, data.event].sort((a, b) => new Date(a.date) - new Date(b.date)));
                return { success: true };
            }
            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Error al crear evento' };
        }
    };

    const updateEvent = async (id, eventData) => {
        try {
            const res = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            const data = await res.json();
            if (data.success) {
                setEvents(events.map(e => e._id === id ? data.event : e).sort((a, b) => new Date(a.date) - new Date(b.date)));
                return { success: true };
            }
            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Error al actualizar evento' };
        }
    };

    const deleteEvent = async (id) => {
        try {
            const res = await fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setEvents(events.filter(e => e._id !== id));
                return { success: true };
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchSubjects();
            fetchEvents();
        }
    }, [token]);

    const value = {
        subjects,
        notes,
        events,
        loading,
        fetchSubjects,
        createSubject,
        updateSubject,
        deleteSubject,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent
    };

    return (
        <StudyContext.Provider value={value}>
            {children}
        </StudyContext.Provider>
    );
};
