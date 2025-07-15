// TaskTimer.jsx
import React, {useEffect, useState} from 'react';

const App = () => {
    const [taskName, setTaskName] = useState('');
    const [notes, setNotes] = useState('');
    const [lessons, setLessons] = useState('');
    const [checkpoints, setCheckpoints] = useState([]);
    const [checkpointModal, setCheckpointModal] = useState(false);
    const [checkpointTitle, setCheckpointTitle] = useState('');
    const [checkpointNote, setCheckpointNote] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [pauseStart, setPauseStart] = useState(null);
    const [pausedTime, setPausedTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [clock, setClock] = useState(new Date());
    const [workedMinutes, setWorkedMinutes] = useState(0);
    const [summaryModal, setSummaryModal] = useState(false);
    const [summaryDetails, setSummaryDetails] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setClock(new Date());
            if (running && startTime) {
                const now = new Date();
                let totalPaused = pausedTime;
                if (pauseStart) {
                    totalPaused += now - pauseStart;
                }
                setWorkedMinutes(((now - startTime - totalPaused) / 60000).toFixed(2));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [running, startTime, pausedTime, pauseStart]);

    const handleStart = () => {
        setStartTime(new Date());
        setPausedTime(0);
        setRunning(true);
        setPauseStart(null);
        setWorkedMinutes(0);
    };

    const handlePause = () => {
        if (running) {
            setPauseStart(new Date());
            setRunning(false);
        }
    };

    const handleResume = () => {
        if (!running && pauseStart) {
            const now = new Date();
            setPausedTime(prev => prev + (now - pauseStart));
            setPauseStart(null);
            setRunning(true);
        }
    };

    const handleFinish = () => {
        const now = new Date();
        let totalPaused = pausedTime;
        if (pauseStart) {
            totalPaused += now - pauseStart;
        }
        const finalWorkedMinutes = ((now - startTime - totalPaused) / 60000).toFixed(2);
        const pausedMinutes = (totalPaused / 60000).toFixed(2);

        setSummaryDetails({
            taskName,
            startTime: startTime?.toLocaleTimeString(),
            endTime: now.toLocaleTimeString(),
            finalWorkedMinutes,
            pausedMinutes,
            notes,
            lessons,
            checkpoints
        });

        setStartTime(null);
        setEndTime(null);
        setPauseStart(null);
        setPausedTime(0);
        setRunning(false);
        setTaskName('');
        setNotes('');
        setLessons('');
        setCheckpoints([]);
        setSummaryModal(true);
    };

    const openCheckpointModal = (index = null) => {
        if (index !== null) {
            setCheckpointTitle(checkpoints[index].title);
            setCheckpointNote(checkpoints[index].note || '');
            setEditingIndex(index);
        } else {
            setCheckpointTitle('');
            setCheckpointNote('');
            setEditingIndex(null);
        }
        setCheckpointModal(true);
    };

    const saveCheckpoint = () => {
        if (editingIndex !== null) {
            setCheckpoints(prev =>
                prev.map((cp, i) => i === editingIndex ? {...cp, title: checkpointTitle, note: checkpointNote} : cp)
            );
        } else {
            setCheckpoints(prev => [...prev, {title: checkpointTitle, note: checkpointNote, done: false}]);
        }
        setCheckpointModal(false);
    };

    const deleteCheckpoint = index => {
        setCheckpoints(prev => prev.filter((_, i) => i !== index));
    };

    const toggleCheckpoint = index => {
        setCheckpoints(prev =>
            prev.map((cp, i) => i === index ? {...cp, done: !cp.done} : cp)
        );
    };

    const copyToClipBoard = async () => {
        let checkPoints = summaryDetails.checkpoints.map( (cp, i) => {
            return `${cp.title}: ${cp.note} ${cp.done ? '(Done)' : ''}`;
        }).join('\n');

        const value = `
Task Name: ${summaryDetails.taskName}
Started At: ${summaryDetails.startTime}
Ended At: ${summaryDetails.endTime}
Time Worked: ${summaryDetails.finalWorkedMinutes}
Paused Time: ${summaryDetails.pausedMinutes}

Notes: ${summaryDetails.notes}
Lessons: ${summaryDetails.lessons}
Check Points:
${checkPoints}
        `
        await navigator.clipboard.writeText(value);
    }

    return (
        <div style={{
            maxWidth: '400px',
            margin: 'auto',
            fontFamily: 'sans-serif',
            color: '#222',
            backgroundColor: '#f4f4f4',
            padding: '20px',
            borderRadius: '10px'
        }}>
            <h2 style={{marginBottom: '10px'}}>{clock.toLocaleDateString()} {clock.toLocaleTimeString()}</h2>
            <h3>Worked Minutes: {workedMinutes}</h3>
            <input
                type="text"
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                placeholder="Task Name"
                style={{width: '97%', marginBottom: '10px', padding: '8px'}}
            />
            <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notes..."
                rows={5}
                style={{width: '97%', marginBottom: '10px', padding: '8px'}}
            />
            <textarea
                value={lessons}
                onChange={e => setLessons(e.target.value)}
                placeholder="Lessons learned..."
                rows={3}
                style={{width: '97%', marginBottom: '10px', padding: '8px'}}
            />
            <div style={{marginBottom: '10px'}}>
                <button onClick={handleStart}>Start</button>
                <button onClick={handlePause}>Pause</button>
                <button onClick={handleResume}>Resume</button>
                <button onClick={handleFinish}>Finish</button>
                <button onClick={() => openCheckpointModal()}>Add Checkpoint</button>
            </div>
            <ul style={{listStyle: 'none', padding: 0}}>
                {checkpoints.map((cp, idx) => (
                    <li key={idx}
                        style={{marginBottom: '10px', background: '#eee', padding: '10px', borderRadius: '4px'}}>
                        <div style={{textDecoration: cp.done ? 'line-through' : 'none', cursor: 'pointer'}}
                             onClick={() => toggleCheckpoint(idx)}>
                            <strong>{cp.title}</strong>
                            {cp.note && <div style={{fontSize: '12px', marginTop: '4px'}}>{cp.note}</div>}
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <button onClick={() => openCheckpointModal(idx)}>Edit</button>
                            <button onClick={() => deleteCheckpoint(idx)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            {checkpointModal && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    background: '#fff',
                    maxHeight: "350px",
                    maxWidth: "280px",
                    border: '1px solid #ccc',
                    padding: '20px',
                    zIndex: 9999,
                    borderRadius: '10px',
                    marginLeft: "20px",
                    overflow: "auto"
                }}>
                    <h3>{editingIndex !== null ? 'Edit Checkpoint' : 'New Checkpoint'}</h3>
                    <input
                        type="text"
                        value={checkpointTitle}
                        onChange={e => setCheckpointTitle(e.target.value)}
                        placeholder="Checkpoint Title"
                        style={{width: '97%', marginBottom: '10px', padding: '6px'}}
                    />
                    <textarea
                        value={checkpointNote}
                        onChange={e => setCheckpointNote(e.target.value)}
                        placeholder="Checkpoint Note"
                        rows={3}
                        style={{width: '97%', padding: '6px'}}
                    />
                    <div style={{marginTop: '10px'}}>
                        <button onClick={saveCheckpoint}>Save</button>
                        <button onClick={() => setCheckpointModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {summaryModal && summaryDetails && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    background: '#fff',
                    maxHeight: "350px",
                    maxWidth: "280px",
                    border: '1px solid #ccc',
                    padding: '20px',
                    zIndex: 9999,
                    borderRadius: '10px',
                    marginLeft: "20px",
                    overflow: "auto"
                }}>
                    <h2>Task Summary</h2>
                    <p><strong>Task Name:</strong> {summaryDetails.taskName}</p>
                    <p><strong>Started At:</strong> {summaryDetails.startTime}</p>
                    <p><strong>Ended At:</strong> {summaryDetails.endTime}</p>
                    <p><strong>Time Worked:</strong> {summaryDetails.finalWorkedMinutes} minutes</p>
                    <p><strong>Paused Time:</strong> {summaryDetails.pausedMinutes} minutes</p>
                    <p><strong>Notes:</strong> {summaryDetails.notes}</p>
                    <p><strong>Lessons:</strong> {summaryDetails.lessons}</p>
                    <h4>Checkpoints:</h4>
                    <ul>
                        {summaryDetails.checkpoints.map((cp, i) => (
                            <li key={i}>
                                <strong>{cp.title}</strong>: {cp.note} {cp.done ? '(Done)' : ''}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setSummaryModal(false)}>Close</button>
                    <button onClick={() => copyToClipBoard()}>Copy</button>
                </div>
            )}
        </div>
    );
};

export default App;