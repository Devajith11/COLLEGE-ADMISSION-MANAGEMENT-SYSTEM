# Software Requirements Specification (SRS)
## GECW Admission Management System

**Version:** 1.0  
**Date:** 2026-02-16  
**Institution:** Government Engineering College, Wayanad (GECW)

---

## 1. Introduction

*   **Purpose:**
    *   Define functional and non-functional requirements.
    *   Guide development of the GECW Admission Management System.
    *   Automate the manual admission process.

*   **Scope:**
    *   **Student Registration:** Online forms for personal and academic data.
    *   **Document Management:** Secure upload/storage of required certificates.
    *   **Admin Control:** Verification, approval, rejection, and reporting.
    *   **Automated Support:** AI Chatbot for 24/7 admission queries.

*   **Technology Stack:**
    *   **Frontend:** React.js, Tailwind CSS.
    *   **Backend:** Node.js, Express.js.
    *   **Database:** MongoDB.

---

## 2. Overall Description

*   **Product Perspective:**
    *   Web-based application.
    *   Replaces manual paper-based admission.
    *   Centralized data storage.

*   **User Roles & Characteristics:**
    *   **Student (Applicant):**
        *   Registers and logs in.
        *   Fills application forms.
        *   Uploads documents.
        *   Tracks application status.
    *   **Admission Clerk (Admin):**
        *   Verifies student data.
        *   Validates uploaded documents.
        *   Approves or rejects applications.
    *   **Super Admin (Principal/HOD):**
        *   Oversees seat filling status.
        *   Generates admission reports.

*   **Operating Environment:**
    *   **Client:** Any modern web browser (Chrome, Edge, Firefox).
    *   **Server:** Node.js runtime environment.
    *   **Database:** MongoDB Atlas (Cloud) or Local.
    *   **Network:** Stable internet connection required.

---

## 3. Specific Requirements

### 3.1 Functional Requirements (FR)

#### 3.1.1 Authentication
*   **FR-01:** Login using KEAM Application Number & Password.
*   **FR-02:** Secure Admin Login for staff.
*   **FR-03:** Password hashing using `bcrypt`.
*   **FR-04:** Session management via JSON Web Tokens (JWT).

#### 3.1.2 Student Module
*   **FR-05:** **Profile Management:**
    *   Input Personal Details (Name, Age, Dob).
    *   Input Guardian Details.
    *   Input Academic Scores (Rank, Marks).
    *   Select Category (General, SC/ST, OEC, SEBC).
*   **FR-06:** **Document Upload:**
    *   Upload SSLC Certificate.
    *   Upload Plus Two Certificate.
    *   Upload Allotment Memo.
    *   Upload Transfer Certificate (TC).
    *   File size validation (Max 5MB).
*   **FR-07:** **Status Tracking:**
    *   View real-time status: *Submitted*, *Verified*, or *Admitted*.

#### 3.1.3 Admin Module
*   **FR-08:** **Dashboard:**
    *   View list of all applicants.
    *   Filter by Branch (CSE, ECE, EEE, ME, CE).
    *   Filter by Status (Pending, Approved).
*   **FR-09:** **Verification:**
    *   Side-by-side view of Data vs Documents.
    *   Approve application (Grant Admission).
    *   Reject application (With Remarks).
*   **FR-10:** **Reporting:**
    *   Export admission list to CSV/Excel.
    *   View live seat counters per branch.

#### 3.1.4 Chatbot Module
*   **FR-11:** **Automated Queries:**
    *   Answer FAQ on Fees.
    *   Answer FAQ on Hostels.
    *   Answer FAQ on Transportation.
*   **FR-12:** **Fallback:**
    *   Provide contact number if query is not understood.

### 3.2 Non-Functional Requirements (NFR)

*   **NFR-01: Performance**
    *   Page load time under 3 seconds.
    *   Support concurrent users during peak admission time.

*   **NFR-02: Security**
    *   Data encryption in transit and at rest.
    *   Protection against SQL/NoSQL injection.
    *   Secure file storage for student documents.

*   **NFR-03: Reliability**
    *   99.9% System Uptime.
    *   Automatic data backups.

*   **NFR-04: Usability**
    *   Mobile-responsive design.
    *   Simple, intuitive user interface.
    *   Clear error messages.

---

## 4. System Interface

*   **User Interface:**
    *   Clean, modern React-based UI.
    *   Responsive layout (Desktop, Tablet, Mobile).
*   **Hardware Interface:**
    *   Runs on standard servers or cloud instances.
*   **Software Interface:**
    *   RESTful API communication.
    *   MongoDB Database connection.

---

## 5. Appendices

*   **Tech Stack:**
    *   **Frontend:** Vite, React, Axios.
    *   **Backend:** Node.js, Express.
    *   **Database:** MongoDB.
    *   **Auth:** JWT, Bcrypt.
