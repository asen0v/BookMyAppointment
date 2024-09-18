/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

const BusinessAvailabilityManager = ({ selectedBusiness }) => {
  const [businessAvailability, setBusinessAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedBusinessAvailability, setSelectedBusinessAvailability] = useState('');
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '18:00',
  });
  const [breaks, setBreaks] = useState([]);
  const [newBreak, setNewBreak] = useState({ start: '', end: '' });

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    if (selectedBusiness) {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      const unsubscribe = onSnapshot(businessRef, (docSnapshot) => {
        const data = docSnapshot.data();
        if (data?.BusinessAvailability) {
          const availability = daysOfWeek.map(day => ({
            id: day,
            day,
            BusinessAvailability: data.BusinessAvailability[day]?.status || 'Not available',
            hours: data.BusinessAvailability[day]?.hours || { start: '09:00', end: '18:00' },
            breaks: data.BusinessAvailability[day]?.breaks || [],
          }));
          setBusinessAvailability(availability);
          if (selectedDay) {
            setBreaks(data.BusinessAvailability[selectedDay]?.breaks || []);
          }
        } else {
          setBusinessAvailability([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedBusiness, selectedDay]);

  const handleSetBusinessAvailability = async () => {
    if (!selectedBusiness || !selectedDay || !selectedBusinessAvailability) {
      alert('Please select a day and set business availability.');
      return;
    }

    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      await updateDoc(businessRef, {
        [`BusinessAvailability.${selectedDay}`]: {
          status: selectedBusinessAvailability,
          hours: selectedBusinessAvailability === 'Available' ? workingHours : { start: '09:00', end: '18:00' },
          breaks: selectedBusinessAvailability === 'Available' ? breaks : [],
        },
      });

      alert('Business availability, working hours, and breaks set successfully!');
      setSelectedDay('');
      setSelectedBusinessAvailability('');
      setWorkingHours({ start: '09:00', end: '18:00' });
      setBreaks([]);
    } catch (error) {
      console.error('Error setting business availability:', error.message);
      alert('Failed to set business availability. Please try again.');
    }
  };

  const handleToggleBusinessAvailability = async (availabilityId, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Not available' : 'Available';
    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      await updateDoc(businessRef, {
        [`BusinessAvailability.${availabilityId}`]: {
          status: newStatus,
          hours: newStatus === 'Available' ? workingHours : { start: '09:00', end: '18:00' },
          breaks: newStatus === 'Available' ? breaks : [],
        },
      });

      alert(`Business availability updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating business availability:', error.message);
      alert('Failed to update business availability. Please try again.');
    }
  };

  const handleWorkingHoursChange = (e) => {
    const { name, value } = e.target;
    setWorkingHours((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewBreakChange = (e) => {
    const { name, value } = e.target;
    setNewBreak((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addBreak = () => {
    if (newBreak.start && newBreak.end) {
      const start = new Date(`1970-01-01T${newBreak.start}:00`);
      const end = new Date(`1970-01-01T${newBreak.end}:00`);

      const hasOverlap = breaks.some(brk => {
        const brkStart = new Date(`1970-01-01T${brk.start}:00`);
        const brkEnd = new Date(`1970-01-01T${brk.end}:00`);
        return (start < brkEnd && end > brkStart);
      });

      if (hasOverlap) {
        alert('This break overlaps with an existing break. Please choose a different time.');
        return;
      }

      const updatedBreaks = [...breaks, newBreak];
      setBreaks(updatedBreaks);

      updateBreaksInFirestore(updatedBreaks);

      setNewBreak({ start: '', end: '' });
    } else {
      alert('Please enter both start and end times for the break.');
    }
  };

  const updateBreaksInFirestore = async (updatedBreaks) => {
    if (!selectedBusiness || !selectedDay) return;

    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      await updateDoc(businessRef, {
        [`BusinessAvailability.${selectedDay}.breaks`]: updatedBreaks,
      });
    } catch (error) {
      console.error('Error updating breaks in Firestore:', error.message);
      alert('Failed to update breaks. Please try again.');
    }
  };

  const handleRemoveBreak = (breakIndex) => {
    const updatedBreaks = breaks.filter((_, index) => index !== breakIndex);
    setBreaks(updatedBreaks);

    updateBreaksInFirestore(updatedBreaks);
  };

  return (
    <div className="container mx-auto p-12 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Business Availability</h1>
  
      {/* Overview Business Availability Section */}
      <div className="bg-white p-6 rounded-lg mt-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Overview Business Availability</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-purple-600 text-white text-sm">
                <th className="py-2 px-4 text-left rounded-tl-lg">Day</th>
                <th className="py-2 px-4 text-left">Availability</th>
                <th className="py-2 px-4 text-left">Working Hours</th>
                <th className="py-2 px-4 text-left">Breaks</th>
                <th className="py-2 px-4 text-left rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {businessAvailability.map((item) => (
                <tr key={item.id} className="border-t border-gray-300 text-sm">
                  <td className="py-2 px-4">{item.day}</td>
                  <td className={`py-2 px-4 ${item.BusinessAvailability === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                    {item.BusinessAvailability}
                  </td>
                  <td className="py-2 px-4">
                    {item.BusinessAvailability === 'Available' ? `${item.hours.start} - ${item.hours.end}` : 'N/A'}
                  </td>
                  <td className="py-2 px-4">
                    {item.BusinessAvailability === 'Available' && item.breaks.length > 0
                      ? item.breaks.map((brk, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            {`${brk.start} - ${brk.end}`}
                            <FontAwesomeIcon
                              icon={faTrash}
                              title="Cancel Break"
                              className="cursor-pointer text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveBreak(index)}
                            />
                          </div>
                        ))
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-4">
                    <FontAwesomeIcon
                      icon={item.BusinessAvailability === 'Available' ? faToggleOff : faToggleOn}
                      title={item.BusinessAvailability === 'Available' ? 'Set Not Available' : 'Set Available'}
                      className={`cursor-pointer ${
                        item.BusinessAvailability === 'Available' ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'
                      }`}
                      onClick={() => handleToggleBusinessAvailability(item.id, item.BusinessAvailability)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessAvailabilityManager;




