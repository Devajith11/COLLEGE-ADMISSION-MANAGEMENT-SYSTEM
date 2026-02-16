# Product Requirements Document (PRD): GECW Admission Management System

**Project:** GEC Wayanad Admission Management System (GECW-AMS)  
**Institution:** Government Engineering College, Wayanad  
**Academic Year:** 2026-2027  
**Tech Stack:** MERN Only (MongoDB, Express.js, React.js, Node.js)  
**Version:** 1.0  

---

## 1. Executive Summary
The **GECW-AMS** is a centralized digital platform designed to automate the admission lifecycle at GEC Wayanad. By utilizing the MERN stack, the system provides a seamless interface for KEAM-allotted students to register, upload documents, and receive automated support through a localized Chatbot, reducing the administrative burden on the college office in Mananthavady.

---

## 2. System Architecture
The system follows the standard MERN architecture to ensure data consistency and real-time updates.



---

## 3. User Personas
| Persona | Role | Primary Goal |
| :--- | :--- | :--- |
| **Student** | Applicant | To submit certificates and track admission status remotely. |
| **Admission Clerk** | Staff / Admin | To verify digital documents and finalize the admission register. |
| **HOD / Principal** | Super Admin | To monitor real-time seat filling across branches (CSE, ECE, EEE, ME, CE). |

---

## 4. Functional Requirements

### 4.1 Student Module (React.js)
* **Authentication:** JWT-based login using KEAM Application Number and a secure password.
* **Profile Management:** Multi-step form to capture personal, guardian, and category (General, SC/ST, OEC, SEBC) data.
* **Document Upload:** * File upload functionality using `multer` (Backend) and `Axios` (Frontend).
    * Validation for mandatory GECW documents: Allotment Memo, SSLC, TC, Physical Fitness, and Income Certificates.
* **Status Tracker:** Real-time dashboard showing the application stage (Submitted → Verified → Admitted).

### 4.2 Admin Module (Node.js & Express)
* **Verification Dashboard:** A table-driven interface to filter students by branch or status.
* **Document Reviewer:** A side-by-side view allowing admins to cross-verify form data against uploaded PDFs.
* **Seat Management:** * Automated counters for the 5 engineering branches.
    * Manual override for Spot Admission entries.
* **Report Generation:** Export student data to CSV/Excel for CEE Kerala compliance.

### 4.3 Helpdesk Admission Chatbot (Internal MERN Logic)
* **Keyword Engine:** A Node.js controller that matches user strings against a MongoDB `knowledge_base`.
* **Contextual FAQ:** * **Fees:** Returns specific structures (e.g., "General: ₹34,600", "SC/ST: Caution Deposit only").
    * **Hostel:** Provides details on the Men's and Ladies' hostels at Thalappuzha.
    * **Transport:** Bus timings and route info from Mananthavady town.
* **Fallback Logic:** Redirects to the college office contact (04935-257321) if keywords are not recognized.

---

## 5. Technical Specifications

### 5.1 Database Schema
The database is structured to handle relational data within a NoSQL environment.



* **Database:** MongoDB (Atlas or Local) — Stores student profiles, document metadata, and chatbot patterns.
* **Backend:** Node.js & Express.js — Handles authentication, file routing, and business logic.
* **Frontend:** React.js (with Tailwind CSS) — Provides a responsive, mobile-first UI for students in rural areas.
* **State Management:** React Context API — Manages user sessions and multi-page form data.

### 5.2 Security & Performance
* **Bcrypt.js:** For hashing administrative and student passwords.
* **JWT:** Secure, stateless token-based authentication.
* **Optimized Loading:** Use of React "Lazy Loading" to ensure the site performs well on 3G/4G connections.

---

## 6. Non-Functional Requirements
* **Localization:** Content tailored specifically to GEC Wayanad's campus rules and Kerala CEE guidelines.
* **Reliability:** 99.9% uptime during the peak 2-week KEAM reporting window.
* **Privacy:** No third-party AI trackers; all chat data and personal files stay within the college's controlled MERN environment.

---

## 7. Project Milestones
1. **Phase 1:** MongoDB Schema Design & Auth API development.
2. **Phase 2:** Multi-step Registration Form & File Upload logic.
3. **Phase 3:** Admin Dashboard & Branch Analytics.
4. **Phase 4:** Keyword-based Chatbot integration & Final User Acceptance Testing (UAT).