import Link from 'next/link';
import { useEffect, useState } from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TeamMemberPage = () => {
  const [teamMemberInfo, setTeamMemberInfo] = useState({});
  const [businessInfo, setBusinessInfo] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);

      const fetchBusinessAndTeamMemberInfo = async () => {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setTeamMemberInfo(userData);

            const businessRef = doc(db, 'businesses', userData.businessId);
            const businessSnap = await getDoc(businessRef);
            if (businessSnap.exists()) {
              setBusinessInfo(businessSnap.data());

              // Fetch recent activity
              const activityRef = doc(db, 'activity', userData.businessId);
              const activitySnap = await getDoc(activityRef);
              if (activitySnap.exists()) {
                setRecentActivity(activitySnap.data().recent || []);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching business or team member info:', error.message);
        }
      };

      fetchBusinessAndTeamMemberInfo();
    }
  }, []);

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Earnings',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <PrivateRoute role="team">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="bg-custom-purple text-white w-56 flex flex-col p-3">
          <Link href="/">
            <div className="flex items-center mb-6 cursor-pointer">
              <img src="/circle.svg" alt="Logo" className="w-10 h-10" />
              <div className="ml-2">
                <h1 className="text-md font-bold">Book</h1>
                <h1 className="text-md font-bold">My</h1>
                <h1 className="text-md font-bold">Appointment</h1>
              </div>
            </div>
          </Link>

          <nav className="flex flex-col flex-grow space-y-3">
            <Link href="/team" className="flex items-center p-1 hover:bg-purple-700 rounded">
              <img src="/home.png" alt="Team Members Home" className="w-5 h-5" />
              <span className="ml-3 text-sm">Dashboard</span>
            </Link>

            <Link href="/team/business-details" className="flex items-center p-1 hover:bg-purple-700 rounded">
              <img src="/businessdetails.png" alt="Overview Business" className="w-5 h-5" />
              <span className="ml-3 text-sm">Overview Business</span>
            </Link>

            <Link href="/team/availability" className="flex items-center p-1 hover:bg-purple-700 rounded">
              <img src="/availability.png" alt="Manage Availability" className="w-5 h-5" />
              <span className="ml-3 text-sm">Manage Availability</span>
            </Link>

            <Link href="/team/manage-appointments" className="flex items-center p-1 hover:bg-purple-700 rounded">
              <img src="/appointments.png" alt="Manage Appointments" className="w-5 h-5" />
              <span className="ml-3 text-sm">Manage Appointments</span>
            </Link>

            <div className="mt-6"></div>

            <button
              onClick={() => {
                const auth = getAuth();
                auth.signOut();
              }}
              className="flex items-center p-1 hover:bg-purple-700 rounded mt-6"
            >
              <img src="/logout.svg" alt="Logout" className="w-5 h-5" />
              <span className="ml-3 text-sm">Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6">
          <div className="bg-white shadow-2xl rounded-lg p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Welcome back, {teamMemberInfo.displayName || 'Team Member'}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white shadow-2xl rounded-lg p-3">
                <h3 className="text-gray-600 text-xs">Role</h3>
                <h1 className="text-md font-bold">{teamMemberInfo.role || 'N/A'}</h1>
              </div>
              <div className="bg-white shadow-2xl rounded-lg p-3">
                <h3 className="text-gray-600 text-xs">Email</h3>
                <h1 className="text-md font-bold">{teamMemberInfo.email || user?.email}</h1>
              </div>
              <div className="bg-white shadow-2xl rounded-lg p-3">
                <h3 className="text-gray-600 text-xs">Assigned Business</h3>
                <h1 className="text-md font-bold">{businessInfo.name || 'N/A'}</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Total Bookings and Sales cards */}
              <div className="bg-white shadow-2xl rounded-lg p-3 relative flex items-center">
                <img src="/book.png" alt="Total Bookings" className="w-6 h-6 mr-2" />
                <div className="flex-grow">
                  <h3 className="text-gray-600 text-xs">Total Bookings</h3>
                  <h1 className="text-lg font-bold absolute bottom-2 right-4">{businessInfo.totalBookings || 0}</h1>
                </div>
              </div>
              <div className="bg-white shadow-2xl rounded-lg p-3 relative flex items-center">
                <img src="/sales.png" alt="Sales" className="w-6 h-6 mr-2" />
                <div className="flex-grow">
                  <h3 className="text-gray-600 text-xs">Total Revenue</h3>
                  <h1 className="text-lg font-bold absolute bottom-2 right-4">£{businessInfo.totalRevenue || 0}</h1>
                </div>
              </div>
            </div>

            {/* Earning Summary Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white shadow-2xl rounded-lg p-3">
                <h3 className="text-md font-bold mb-1">Earning Summary</h3>
                <div className="h-56 w-full">
                  <Line data={chartData} />
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-white shadow-2xl rounded-lg p-3 -mt-4">
                <h3 className="text-md font-bold mb-1 text-center">Calendar</h3>
                <div className="flex justify-center">
                  <div className="w-full">
                    <Calendar
                      className="custom-calendar mx-auto"
                      tileClassName={({ date, view }) => {
                        // Add custom class for specific dates
                        if (view === 'month') {
                          if (date.getDay() === 6 || date.getDay() === 0) {
                            return 'react-calendar__month-view__days__day--weekend';
                          }
                          if (date.getDate() === 14) {
                            return 'react-calendar__tile--active';
                          }
                        }
                        return null;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reminders Section */}
            <div className="bg-white shadow-2xl rounded-lg p-3 mt-4">
              <h3 className="text-md font-bold mb-1">Reminders</h3>
              <p className="text-xs text-gray-500">No new reminders</p>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default TeamMemberPage;












