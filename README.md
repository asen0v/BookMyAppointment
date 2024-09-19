**BookMyAppointment Readme**

**BookMyAppointment** is a web application designed to streamline the process of scheduling appointments for various services. It offers a user-friendly interface for business owners, team members, and customers, allowing them to manage appointments, business availability, and services efficiently. 

**Features** 

- **Business Registration:** Allows business owners to register their business details and upload logos. 
- **Team Management:** Facilitates team member registration and availability management. 
- **Service Management:** Enables business owners to create and manage service offerings. 
- **Appointment Booking:** Customers can book appointments by selecting businesses, services, and available time slots. 
- **Appointment Management:** Business owners and team members can view, edit, reschedule, or cancel appointments. 
- **Firebase Integration:** Uses Firebase for backend services, including Authentication, Firestore Database, and Cloud Storage. 

**Tech Stack** 

- **Frontend:** Next.js, React 
- **Backend:** Firebase (Firestore, Authentication, Cloud Storage) 
- **Styling:** Tailwind CSS 
- **State Management:** Redux 

**Prerequisites** 

- Node.js and npm installed 
- Firebase account 
- Visual Studio Code or any preferred code editor 
- Unzip utility (if working with a zip file) 

**Installation** 

1. **Unzip the file:** 
- Unzip the provided file to access the project directory. 
2. **Navigate to the project directory:** 

![Unzip](https://i.ibb.co/42NSc2s/Aspose-Words-7115f250-02b2-41d8-b451-7df2d713d30e-001.png)

Or Clone the repository: 

git clone [https://github.com/asen0v/bookmyappointment.git](https://github.com/asen0v/BookMyAppointment.git) cd bookmyappointment

1. **Unzip the file:** 
- Unzip the provided file to access the project directory. 
2. **Navigate to the project directory:** 

![](https://i.ibb.co/42NSc2s/Aspose-Words-7115f250-02b2-41d8-b451-7df2d713d30e-001.png)

**Or Clone the repository**:    (when the finished project  will be uploaded on GitHub ) git clone [https://github.com/asen0v/bookmyappointment.git](https://github.com/asen0v/BookMyAppointment.git) cd bookmyappoi ntment

3. **Install dependencies:** 

![](https://i.ibb.co/42m3L7G/Aspose-Words-7115f250-02b2-41d8-b451-7df2d713d30e-002.png)

4. **Set up Firebase:** 
- Create a Firebase project and register your web app. 
- Enable Firebase Authentication with Email/Password. 
- Set up Firestore Database and Cloud Storage. 
- Obtain your Firebase configuration details (API key, project ID, etc.) and update the firebaseconfig.js file in the utils directory with your configuration. 
5. **Run the application:** 

![](https://i.ibb.co/QPfwGBB/Aspose-Words-7115f250-02b2-41d8-b451-7df2d713d30e-003.png)

   The application will run locally on http://localhost:3000. 

**Firebase Configuration** 

Replace the existing Firebase configuration in the firebaseconfig.js file located in the utils directory with your Firebase project details: 

![](https://i.ibb.co/RQYWwx3/Aspose-Words-7115f250-02b2-41d8-b451-7df2d713d30e-004.jpg)

**Usage** 

1. **Register a Business** 
- Navigate to the "Register Business" page. 
- Fill in the business details, select a category, and upload a logo. 
2. **Manage Business Availability** 
- Set working hours and breaks for each day of the week. 
- Adjust availability easily through the interface. 
3. **Add Team Members** 
- Team members can register and manage their personal availability. 
4. **Create and Manage Services** 
- Add new services by specifying details such as name, description, category, and duration. 
- Assign services to team members. 
5. **Book Appointments** 
- Customers can book appointments by selecting a business, choosing a service, and picking an available time slot. 
- Confirmation emails are sent upon successful booking. 
6. **View and Manage Appointments** 
- Both customers and business owners can view, edit, reschedule, or cancel appointments. 

**Contributing** 

Contributions are welcome! Please fork the repository and submit a pull request for review. **License** 

This project is licensed under the MIT License. 

**Contact** 

For any questions or support, please contact team@bookmyappointment.com  


