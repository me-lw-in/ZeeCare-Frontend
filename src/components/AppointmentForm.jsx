import React, { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../Styles/Dashboard.css'

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [Department, setDepartment] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const [doctors, setDoctors] = useState(["Dr. Smith", "Dr. Patel","Dr. Sharma"]);
  const navigate = useNavigate();

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", {
          withCredentials: true,
        });
        setDoctors(data.doctors);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctors();
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          Department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          address,
          hasVisited: hasVisitedBool,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="container form-component appointment-form" >
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment} style={{width:'1000px'}}>
        <div>
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="number" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <input type="number" placeholder="NIC" value={nic} onChange={(e) => setNic(e.target.value)} />
          <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="date" placeholder="Appointment Date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
        </div>
        <div>
  <select
    value={Department}
    onChange={(e) => {
      setDepartment(e.target.value);
      setDoctorFirstName("");
      setDoctorLastName("");
    }}
  >
    <option value="">Select Department</option>
    {departmentsArray.map((depart, index) => (
      <option key={index} value={depart}>
        {depart}
      </option>
    ))}
  </select>

  <select
    value={`${doctorFirstName} ${doctorLastName}`}
    onChange={(e) => {
      const [first, ...rest] = e.target.value.split(" ");
      const last = rest.join(" ");
      setDoctorFirstName(first);
      setDoctorLastName(last);
    }}
    disabled={Department}
  >
    <option value="">Select Doctor</option>
    {doctors
      .filter((doctor) => doctor.doctorDepartment === Department)
      .map((doctor, index) => (
        <option
          key={index}
          value={`${doctor.firstName} ${doctor.lastName}`}
        >
          {doctor.firstName} {doctor.lastName}
        </option>
      ))}
  </select>
</div>

        <textarea
          rows="10"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />

        <div style={{ gap: "10px", justifyContent: "flex-end", flexDirection: "row" }}>
          <p style={{ marginBottom: 0 }}>Already Registered?</p>
          <input
            type="checkbox"
            checked={hasVisited}
            onChange={(e) => setHasVisited(e.target.checked)}
            style={{ flex: "none", width: "25px" }}
          />
        </div>

        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">GET APPOINTMENT</button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
