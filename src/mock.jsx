import React, { useState, useRef } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  CheckSquare,
  Users,
  Activity,
  Bell,
  ListChecks,
  FilePlus2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowLeft,
  FolderOpen,
  Flag,
  AlertTriangle,
  Clock,
  FileText,
  ShieldAlert,
  MinusCircle,
  Pencil,
  UploadCloud,
  Plus,
  CheckCircle2,
  PlayCircle,
  XCircle,
  X,
  Layers,
  EyeOff,
  Building2,
  ArrowRight,
  Loader2,
  LogOut,
  Info,
  Pill,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static demo data
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "case-tracking", label: "Case Tracking", icon: ClipboardList },
  { key: "enrollment", label: "Enrollment", icon: UserPlus },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
];

const QUICK_ACTIONS = [
  { label: "New Enrollment", sub: "Create patient", icon: FilePlus2 },
  { label: "View Tasks", sub: "Follow-up", icon: ListChecks },
];



const STATUS_OPTIONS = ["All Statuses", "Awaiting Questionnaire", "Awaiting Response", "Cases Under Plan Review", "Decisioned Cases", "Plan Needs More Information", "Eligibility Failed"];

// Case Tracking table data (Programme column intentionally removed)
const AVATAR_COLORS = [
  "bg-sky-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-fuchsia-500",
  "bg-rose-500",
  "bg-slate-400",
  "bg-violet-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-pink-500",
];

const CASE_TRACKING_ROWS = [
  { patient: "Mini Mouse", memberId: "MEM19850041", caseId: "CASE-00041", programme: "Botox drug program", stage: "—", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 28, 2026", overdue: true, enrollmentDate: "Jun 28, 2026 2:46 PM", eligibilityStatus: "success", paRequired: true, questionsSubmitted: false, intakeChannel: "Embedded UI" },
  { patient: "Mickey Mouse", memberId: "MEM19850040", caseId: "CASE-00040", programme: "Botox drug program", stage: "Data & Intake", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 28, 2026", overdue: true, enrollmentDate: "Jun 28, 2026 1:20 PM", eligibilityStatus: "failed", eligibilityFailureReason: "Member ID Invalid", paRequired: false, intakeChannel: "API" },
  { patient: "Madmax G Madmax", memberId: "MEM19850038", caseId: "CASE-00038", programme: "Bonofide", stage: "—", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 28, 2026", overdue: true, enrollmentDate: "Jun 27, 2026 9:01 PM", paStatus: "Approved", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "API", drugName: "ACTEMRA 162 MG/0.9 ML SYRINGE", routeOfAdministration: "Subcutaneous", prescriberName: "Scot Lovejoy", urgency: "Not Urgent", dateCreated: "06/27/2026 21:01:00", reviewSubmittedDate: "06/27/2026 21:45:12", dateClosed: "07/29/2026 14:42:16", estimatedEndDate: "08/04/2026 21:01:00", createdBy: "Aravind Reddy", authStartDate: "07/29/2026", authEndDate: "07/29/2026", authorizationId: "AUTH-8827461", approvedQuantity: "1 Syringe", approvedDaysSupply: "28 days" },
  { patient: "Disney World", memberId: "MEM19850035", caseId: "CASE-00035", programme: "Sun Tech", stage: "Benefits Investigation", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jul 1, 2026", overdue: true, enrollmentDate: "Jun 24, 2026 10:35 AM", paStatus: "Denied", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "Embedded UI", drugName: "OZEMPIC 0.25-0.5 MG/DOSE PEN", routeOfAdministration: "Subcutaneous", prescriberName: "Scot Lovejoy", urgency: "Not Urgent", dateCreated: "06/24/2026 10:35:00", reviewSubmittedDate: "06/24/2026 11:20:44", dateClosed: "07/29/2026 14:27:54", estimatedEndDate: "—", createdBy: "Aravind Reddy", authStartDate: "—", authEndDate: "—", authorizationId: "AUTH-8827398", denialReason: "the medication does not meet the plan\u2019s step therapy requirements" },
  { patient: "Santosh Test Nair", memberId: "MEM19850034", caseId: "CASE-00034", programme: "Bonofide", stage: "Data & Intake", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 24, 2026", overdue: false, enrollmentDate: "Jun 24, 2026 9:56 AM", eligibilityStatus: "pending", intakeChannel: "API" },
  { patient: "Priya Sharma", memberId: "MEM19850036", caseId: "CASE-00036", programme: "Sun Tech", stage: "Coordination", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 26, 2026", overdue: false, enrollmentDate: "Jun 25, 2026 11:12 AM", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "Embedded UI" },
  { patient: "Unknown", memberId: "MEM19850033", caseId: "CASE-00033", programme: "Sun Tech", stage: "Enrollment", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 24, 2026", overdue: true, enrollmentDate: "Jun 24, 2026 3:55 AM", eligibilityStatus: "failed", eligibilityFailureReason: "Date of Birth Invalid", paRequired: false, intakeChannel: "Embedded UI" },
  { patient: "Jack Mark", memberId: "MEM19850032", caseId: "CASE-00032", programme: "Sun Tech", stage: "Treatment Scheduling", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 28, 2026", overdue: true, enrollmentDate: "Jun 24, 2026 3:54 AM", eligibilityStatus: "failed", paRequired: false, intakeChannel: "API" },
  { patient: "Jackson Smith", memberId: "MEM19850031", caseId: "CASE-00031", programme: "Bonofide", stage: "Coordination", status: "Open", caseUrgency: "Urgent", slaDue: "Jul 5, 2026", overdue: true, enrollmentDate: "Jun 23, 2026 4:47 PM", paStatus: "Partially Approved", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "Embedded UI", drugName: "HUMIRA 40 MG/0.4 ML PEN", routeOfAdministration: "Subcutaneous", prescriberName: "Scot Lovejoy", urgency: "Not Urgent", dateCreated: "06/23/2026 16:47:00", reviewSubmittedDate: "06/23/2026 17:30:08", dateClosed: "07/29/2026 14:35:41", estimatedEndDate: "10/27/2026 16:47:00", createdBy: "Aravind Reddy", authStartDate: "07/29/2026", authEndDate: "10/27/2026", authorizationId: "AUTH-8827412", approvedQuantity: "2 Pens", approvedDaysSupply: "90 days", partialReason: "quantity approved is limited to a 3-month supply pending re-authorization" },
  { patient: "Krish Watson", memberId: "MEM19850030", caseId: "CASE-00030", programme: "Bonofide", stage: "Coordination", status: "Open", caseUrgency: "Urgent", slaDue: "Jun 23, 2026", overdue: true, enrollmentDate: "Jun 23, 2026 4:28 PM", paStatus: "Plan Needs More Information", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "API", drugName: "ACTEMRA 162 MG/0.9 ML SYRINGE", routeOfAdministration: "Subcutaneous", prescriberName: "Scot Lovejoy", urgency: "Not Urgent", dateCreated: "06/23/2026 16:28:00", reviewSubmittedDate: "06/23/2026 17:10:22", estimatedEndDate: "—", createdBy: "Aravind Reddy", authStartDate: "—", authEndDate: "—", authorizationId: "AUTH-8827455", moreInfoRequested: "additional chart notes documenting the patient\u2019s most recent disease activity assessment" },
  { patient: "Emma Mark", memberId: "MEM19850029", caseId: "CASE-00029", programme: "Sun Tech", stage: "Benefits Investigation", status: "Open", caseUrgency: "Urgent", slaDue: "Jun 25, 2026", overdue: true, enrollmentDate: "Jun 23, 2026 4:07 PM", eligibilityStatus: "failed", paRequired: false, intakeChannel: "Embedded UI" },
];

// ---------------------------------------------------------------------------
// Core platform — Prior Authorization deep-link screen
// (separate module, reached only via a Task deep link — scoped to this screen only)
// ---------------------------------------------------------------------------

// Partner self-service user management -- off by default for every Partner.
// AnvayaRx Admin enables this per-Partner from Govern's Super Admin > Groups,
// by granting the core.user_admin.manage / core.user_admin.read permissions to
// that Partner's group (Section 4.2.2). This flag stands in for that
// Partner-specific permission state in this mock; flip to true to preview
// what a Partner sees once AnvayaRx Admin has turned it on for them.
const PARTNER_USER_MANAGEMENT_ENABLED = false;

const CORE_NAV_ITEMS = PARTNER_USER_MANAGEMENT_ENABLED ? ["Cases", "Patients", "Users"] : ["Cases", "Patients"];

// Patients list — same people as CASE_TRACKING_ROWS so the Cases/Enrolments
// sub-tables on the patient detail view can link straight through.
const PATIENTS = [
  { name: "Emma Mark", mrn: "MRN-00027", email: "john.anderson_55@yopmail.com", phone: "7777788888", dob: "June 22, 2026", gender: "Female", status: "Active", caseId: "CASE-00029", enrolmentId: "ENR-0048" },
  { name: "Unknown", mrn: "MRN-00031", email: "—", phone: "—", dob: "—", gender: "Unknown", status: "Active", caseId: "CASE-00033", enrolmentId: "ENR-809DDB8C" },
  { name: "Jackson Smith", mrn: "MRN-00008", email: "naoh.field4@yopmail.com", phone: "1111111111", dob: "September 7, 2000", gender: "Male", status: "Active", caseId: "CASE-00031", enrolmentId: "ENR-0052" },
  { name: "Santosh Test Nair", mrn: "MRN-00026", email: "naoh.field3@yopmail.com", phone: "—", dob: "—", gender: "Unknown", status: "Active", caseId: "CASE-00034", enrolmentId: "ENR-646F33E6" },
  { name: "Krish Watson", mrn: "MRN-00028", email: "krish@gmail.com", phone: "8778988776", dob: "June 18, 2026", gender: "Male", status: "Active", caseId: "CASE-00030", enrolmentId: "ENR-A5C38E9C" },
  { name: "Mickey Mouse", mrn: "MRN-00037", email: "mickey.mouse@allfreemail.net", phone: "1234567890", dob: "June 26, 2000", gender: "Male", status: "Active", caseId: "CASE-00040", enrolmentId: "ENR-0061" },
  { name: "Mini Mouse", mrn: "MRN-00039", email: "mini.mouse@allfreemail.net", phone: "6673516560", dob: "June 22, 2026", gender: "Unknown", status: "Active", caseId: "CASE-00041", enrolmentId: "ENR-0062" },
  { name: "Madmax G Madmax", mrn: "MRN-00019", email: "naoh.field1@yopmail.com", phone: "—", dob: "June 12, 2026", gender: "Male", status: "Active", caseId: "CASE-00038", enrolmentId: "ENR-0059" },
  { name: "Disney World", mrn: "MRN-00020", email: "naoh.field2@yopmail.com", phone: "—", dob: "January 20, 2003", gender: "Male", status: "Active", caseId: "CASE-00035", enrolmentId: "ENR-0053" },
  { name: "Jack Mark", mrn: "MRN-00014", email: "rendell.jamar@allwebemails.com", phone: "—", dob: "January 20, 2003", gender: "Male", status: "Active", caseId: "CASE-00032", enrolmentId: "" },
];

// The 6-step Prior Authorization pipeline used on the Core case screen, for every case.
const CORE_STAGE_LABELS = ["Data & Intake", "Coverage Determination", "Benefits Investigation", "Prior Authorization", "PA Review", "Appeals"];

const PA_QUESTIONS = [
  { id: 1, text: "Has the patient tried and failed a preferred alternative therapy?" },
  { id: 2, text: "What is the patient's current weight (kg) for dosing calculation?" },
  { id: 3, text: "Is there documented evidence of muscle spasticity in the target area?" },
  { id: 4, text: "Has the prescriber attached supporting clinical notes for this request?" },
  { id: 5, text: "Any additional comments for the payer's review team?" },
];

// Fixed demo answers for cases whose PA has already been decided — shown
// read-only, so a resolved case doesn't present the same blank question flow
// as an unanswered one.
const PA_QUESTION_ANSWERS = [
  "Yes — patient failed a 3-month trial of a preferred alternative therapy due to inadequate response.",
  "72 kg",
  "Yes — documented in the clinical notes submitted with this case.",
  "Yes — supporting clinical notes were attached at submission.",
  "No additional comments.",
];

// Parallel to PA_QUESTION_ANSWERS -- filename of the supplementary document
// uploaded alongside that specific question's answer, or null if none was attached.
const PA_QUESTION_DOCUMENTS = [
  "Prior_Therapy_Failure_Notes.pdf",
  null,
  null,
  "Supporting_Clinical_Notes.pdf",
  null,
];

const PA_STATUS_STYLES = {
  "Awaiting Questionnaire": { pill: "border-slate-300 bg-slate-100 text-slate-600", icon: Clock },
  "Awaiting Response": { pill: "border-amber-200 bg-amber-50 text-amber-600", icon: Clock },
  "Case Under Plan Review": { pill: "border-amber-200 bg-amber-50 text-amber-600", icon: Clock },
  Approved: { pill: "border-green-200 bg-green-50 text-green-600", icon: CheckCircle2 },
  Denied: { pill: "border-red-200 bg-red-50 text-red-600", icon: XCircle },
  "Partially Approved": { pill: "border-orange-200 bg-orange-50 text-orange-600", icon: AlertTriangle },
  "Plan Needs More Information": { pill: "border-purple-200 bg-purple-50 text-purple-600", icon: AlertTriangle },
};

// Hover-tooltip copy for each PA Status datapoint's info icon. Left blank for
// now -- populate once the exact field definitions are provided.
const PA_FIELD_DESCRIPTIONS = {
  "Urgency": "",
  "Estimated End Date & Time": "",
  "Date & Time Created": "",
  "Review Submitted Date & Time": "",
  "Date & Time Closed": "",
  "Status/Decision": "",
  "Authorization ID": "",
  "Authorization Start Date": "",
  "Authorization End Date": "",
  "Approved Quantity": "",
  "Approved Days Supply": "",
};

// Tasks — PA Questions / PA Status are the new, most-used types; existing generic
// types (signature, document_request, other) are kept as-is for other workflows.
const TASKS = [
  { title: "Answer PA Questions", type: "pa_questions", caseId: "CASE-00041", programme: "Botox drug program", caseUrgency: "Not Urgent", status: "Pending", dueDate: "Jul 2, 2026", createdAt: "Jun 28, 2026" },
  { title: "PA Status", type: "pa_status", caseId: "CASE-00038", programme: "Bonofide", caseUrgency: "Not Urgent", status: "Pending", dueDate: "—", createdAt: "Jun 27, 2026" },
  { title: "PA Status", type: "pa_status", caseId: "CASE-00031", programme: "Bonofide", caseUrgency: "Urgent", status: "Pending", dueDate: "—", createdAt: "Jun 23, 2026" },
  { title: "PA Status", type: "pa_status", caseId: "CASE-00030", programme: "Bonofide", caseUrgency: "Urgent", status: "Pending", dueDate: "—", createdAt: "Jun 23, 2026" },
];

const TASK_STATUS_STYLES = {
  Acknowledged: "border-amber-200 bg-amber-50 text-amber-600",
  Responded: "border-sky-200 bg-sky-50 text-sky-600",
  Completed: "border-green-200 bg-green-50 text-green-600",
  Pending: "border-slate-200 bg-slate-100 text-slate-500",
};

const URGENCY_STYLES = {
  "Urgent": "border-orange-200 text-orange-600 bg-white",
  "Not Urgent": "border-indigo-200 text-indigo-600 bg-white",
};

// Enrollments list data (Programme + Submitted Via columns intentionally removed)
// Case IDs line up with CASE_TRACKING_ROWS so "open linked case" can jump straight there.
const ENROLLMENT_STATUS_STYLES = {
  Accepted: { pill: "bg-green-50 text-green-600 border-green-200", icon: CheckCircle2 },
  Draft: { pill: "bg-slate-100 text-slate-500 border-slate-200", icon: FileText },
  Submitted: { pill: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: Clock },
};

const ENROLLMENTS = [
  { patient: "Mini Mouse", enrollmentId: "ENR-0062", caseId: "CASE-00041", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 28, 2026 2:46 PM" },
  { patient: "Mickey Mouse", enrollmentId: "ENR-0061", caseId: "CASE-00040", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 28, 2026 1:18 PM" },
  { patient: "Madmax G Madmax", enrollmentId: "ENR-0059", caseId: "CASE-00038", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 27, 2026 9:00 PM" },
  { patient: "—", enrollmentId: "ENR-0054", caseId: "—", status: "Draft", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 12:22 PM" },
  { patient: "Santosh Test Nair Test", enrollmentId: "ENR-646F33E6", caseId: "CASE-00034", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 9:56 AM" },
  { patient: "Disney World", enrollmentId: "ENR-0053", caseId: "CASE-00035", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 9:04 AM" },
  { patient: "—", enrollmentId: "ENR-809DDB8C", caseId: "CASE-00033", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 3:55 AM" },
  { patient: "—", enrollmentId: "ENR-A5C38E9C", caseId: "CASE-00032", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 3:54 AM" },
  { patient: "Jackson Smith", enrollmentId: "ENR-0052", caseId: "CASE-00031", status: "Accepted", caseUrgency: "Urgent", createdAt: "Jun 23, 2026 4:44 PM" },
  { patient: "Helen Garth", enrollmentId: "ENR-0051", caseId: "—", status: "Submitted", caseUrgency: "Not Urgent", createdAt: "Jun 23, 2026 4:42 PM" },
];

const ENROLLMENT_TABS = [
  "Patient Information",
  "Patient Insurance",
  "Prescriber Information",
  "Rendering Provider",
  "Pharmacy",
  "Diagnosis",
  "Prescription",
  "Prescriber Signature",
  "Submission",
];

// ---------------------------------------------------------------------------
// Mock enrollment data builders
// ---------------------------------------------------------------------------

function emptyEnrollmentData() {
  return {
    patient: { firstName: "", lastName: "", dob: "", gender: "", preferredLanguage: "", addressLine1: "", addressLine2: "", city: "", state: "", zip: "", country: "" },
    insurance: { memberId: "", primaryInsurance: "", primaryPolicyHolder: "", primaryPolicyId: "", primaryGroup: "", primaryPhoneType: "Mobile", primaryPhone: "", secondaryInsurance: "", secondaryPolicyHolder: "", secondaryPolicyId: "", secondaryGroup: "", secondaryPhoneType: "Mobile", secondaryPhone: "" },
    prescriber: { accountName: "", firstName: "", lastName: "", npi: "", stateLicense: "", taxId: "", phoneType: "Mobile", phone: "", faxType: "Mobile", fax: "", streetAddress: "", suite: "", city: "", state: "", zip: "", country: "" },
    renderingProvider: { sameAsPrescriber: true, firstName: "", lastName: "", npi: "", phoneType: "Mobile", phone: "", faxType: "Mobile", fax: "", streetAddress: "", suite: "", city: "", state: "", zip: "", country: "" },
    pharmacy: { npi: "", ncpdpId: "", businessName: "", streetAddress: "", suite: "", city: "", state: "", zip: "", country: "", phoneType: "Mobile", phone: "", faxType: "Mobile", fax: "" },
    diagnosis: { icd10: "", otherCode: "" },
    prescription: { drugName: "", ndc: "", jCode: "", quantity: "", daysSupply: "", startDateOfService: "", endDateOfService: "", buyAndBill: "", administeredLocation: "", dosageForm: "", routeOfAdministration: "", strength: "", strengthUnit: "", firstInfusion: false, secondInfusion: false, subsequentInfusion: false, refillQuantity: "", mostRecentDMT: "", allergies: "", sendEPrescription: false, otherDiagnosisCode: "" },
    signature: { certifiedName: "", date: "", agreed: false },
    submission: { caseUrgency: "Not Urgent" },
  };
}

function mockEnrollmentDataFromCase(caseItem) {
  const parts = (caseItem?.patient || "Unknown Patient").split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "—";
  return {
    patient: {
      firstName,
      lastName,
      dob: "04/12/1985",
      gender: "Female",
      preferredLanguage: "English",
      addressLine1: "221B Baker Street",
      addressLine2: "",
      city: "Springfield",
      state: "IL",
      zip: "62704",
      country: "United States",
    },
    insurance: {
      memberId: caseItem?.memberId || "MEM19850000",
      primaryInsurance: "Anthem BlueCross",
      primaryPolicyHolder: caseItem?.patient || "",
      primaryPolicyId: caseItem?.memberId ? `${caseItem.memberId}-X` : "INVALID-ID",
      primaryGroup: "GRP-4521",
      primaryPhoneType: "Mobile",
      primaryPhone: "(555) 010-2938",
      secondaryInsurance: "",
      secondaryPolicyHolder: "",
      secondaryPolicyId: "",
      secondaryGroup: "",
      secondaryPhoneType: "Mobile",
      secondaryPhone: "",
    },
    prescriber: {
      accountName: caseItem?.programme || "Sun Tech Specialty Pharmacy",
      firstName: "Scot",
      lastName: "Lovejoy",
      npi: "1234567890",
      stateLicense: "IL-88213",
      taxId: "XX-XXXXXXX",
      phoneType: "Mobile",
      phone: "(555) 431-9020",
      faxType: "Mobile",
      fax: "(555) 431-9021",
      streetAddress: "400 Meridian Ave",
      suite: "Suite 220",
      city: "Springfield",
      state: "IL",
      zip: "62701",
      country: "United States",
    },
    renderingProvider: {
      sameAsPrescriber: true,
      firstName: "",
      lastName: "",
      npi: "",
      phoneType: "Mobile",
      phone: "",
      faxType: "Mobile",
      fax: "",
      streetAddress: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    pharmacy: {
      npi: "1922334455",
      ncpdpId: "3299481",
      businessName: "Sun Tech Specialty Pharmacy",
      streetAddress: "18 Commerce Way",
      suite: "",
      city: "Springfield",
      state: "IL",
      zip: "62702",
      country: "United States",
      phoneType: "Mobile",
      phone: "(555) 887-2200",
      faxType: "Mobile",
      fax: "(555) 887-2201",
    },
    diagnosis: { icd10: "G35 MS", otherCode: "" },
    prescription: {
      drugName: "Botox",
      ndc: "00023-1145-01",
      jCode: "J0585",
      quantity: "1",
      daysSupply: "90",
      startDateOfService: "07/01/2026",
      endDateOfService: "09/28/2026",
      administeredLocation: "Physician's Office",
      buyAndBill: "Yes",
      dosageForm: "Injection",
      routeOfAdministration: "Intramuscular",
      strength: "100",
      strengthUnit: "units/vial",
      firstInfusion: false,
      secondInfusion: false,
      subsequentInfusion: false,
      refillQuantity: "2",
      mostRecentDMT: "",
      allergies: "NKDA",
      sendEPrescription: true,
      otherDiagnosisCode: "",
    },
    signature: { certifiedName: "Scot Lovejoy", date: "06/28/2026", agreed: true },
    submission: { caseUrgency: caseItem?.caseUrgency || "Not Urgent" },
  };
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function OpenStatusBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-indigo-600">
      <FolderOpen size={12} /> Open
    </span>
  );
}

// Single source of truth for a case's processing status, derived from its
// eligibility/PA data — used by both the Case Tracking list and the case
// detail view so the two never disagree, and every case isn't "Eligibility Failed."
const CASE_STATUS_TONE_STYLES = {
  red: { className: "border-red-200 bg-red-50 text-red-600", icon: AlertTriangle },
  green: { className: "border-green-200 bg-green-50 text-green-600", icon: CheckCircle2 },
  orange: { className: "border-orange-200 bg-orange-50 text-orange-600", icon: AlertTriangle },
  amber: { className: "border-amber-200 bg-amber-50 text-amber-600", icon: Clock },
  blue: { className: "border-indigo-200 bg-indigo-50 text-indigo-600", icon: FileText },
  slate: { className: "border-slate-300 bg-slate-100 text-slate-600", icon: FileText },
  purple: { className: "border-purple-200 bg-purple-50 text-purple-600", icon: AlertTriangle },
};

// Standardized case-status taxonomy (6 canonical buckets), applied identically
// in Case Tracking's Status column and everywhere else a case status is shown,
// for both the Partner and AnvayaRx Admin views:
//   1. Eligibility Failed          -- eligibilityStatus="failed"; specific reason shown on click-through only
//   2. Awaiting Questionnaire      -- eligibilityStatus="pending": Agadia-level Eligibility/BI validation still running
//   3. Awaiting Response           -- Eligibility/BI passed, questionnaire arrived, Partner has not yet submitted answers
//   4. Cases Under Plan Review     -- answers submitted, awaiting the PA decision from Agadia/Payer
//   5. Decisioned Cases            -- paStatus is Approved / Denied / Partially Approved; specific outcome shown on click-through only
//   6. Plan Needs More Information -- its own distinct bucket, not grouped with Decisioned Cases
function getCaseStatusInfo(caseItem) {
  if (caseItem.eligibilityStatus === "failed") {
    return { label: "Eligibility Failed", tone: "red" };
  }
  if (caseItem.eligibilityStatus === "pending") {
    return { label: "Awaiting Questionnaire", tone: "slate" };
  }
  if (caseItem.paStatus === "Plan Needs More Information") {
    return { label: "Plan Needs More Information", tone: "purple" };
  }
  if (caseItem.paStatus === "Approved" || caseItem.paStatus === "Denied" || caseItem.paStatus === "Partially Approved") {
    return { label: "Decisioned Cases", tone: "slate" };
  }
  if (caseItem.paRequired) {
    if (caseItem.questionsSubmitted) {
      return { label: "Cases Under Plan Review", tone: "amber" };
    }
    return { label: "Awaiting Response", tone: "amber" };
  }
  return { label: "In Benefits Investigation", tone: "blue" };
}

// Maps a case onto the same 6-pentagon pipeline used on the Core PA screen
// (Data & Intake, Coverage Determination, Benefits Investigation, Prior
// Authorization, PA Review, Appeals) so both portals always agree.
function getCoreStageIndex(caseItem) {
  if (caseItem.eligibilityStatus === "pending") return 1; // Eligibility/BI still running -- sitting at Coverage Determination
  if (caseItem.eligibilityStatus === "failed") return 1; // stuck at Coverage Determination
  if (caseItem.paStatus || caseItem.paRequired) return 3; // in/through Prior Authorization
  return 2; // cleared eligibility, sitting in Benefits Investigation
}

function CaseStatusBadge({ caseItem, showReason = false }) {
  const { label, tone } = getCaseStatusInfo(caseItem);
  const style = CASE_STATUS_TONE_STYLES[tone];
  const Icon = style.icon;
  const displayLabel = showReason && caseItem.eligibilityStatus === "failed" ? `${label} \u2014 ${caseItem.eligibilityFailureReason || "Reason not specified"}` : label;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${style.className}`}>
      <Icon size={12} /> {displayLabel}
    </span>
  );
}

function UrgencyBadge({ urgency }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium ${URGENCY_STYLES[urgency] || URGENCY_STYLES["Not Urgent"]}`}>
      <Flag size={12} /> {urgency}
    </span>
  );
}

function EnrollmentStatusBadge({ status }) {
  const style = ENROLLMENT_STATUS_STYLES[status] || ENROLLMENT_STATUS_STYLES.Draft;
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium ${style.pill}`}>
      <Icon size={12} /> {status}
    </span>
  );
}

function SlaCell({ date, overdue }) {
  return (
    <div>
      <p className="text-sm text-slate-700">{date}</p>
      {overdue && <span className="mt-0.5 inline-block rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">Overdue</span>}
    </div>
  );
}

function PatientAvatar({ name, colorClass }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${colorClass}`}>
      {initials}
    </span>
  );
}

function ProgressRing({ percent, color, size = 96, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EEF0F4" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
    </svg>
  );
}

function Card({ className = "", children, onClick }) {
  return (
    <div onClick={onClick} className={`rounded-xl border border-slate-200 bg-white ${className}`}>
      {children}
    </div>
  );
}

function FilterSelect({ label }) {
  return (
    <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
      {label}
      <ChevronDown size={12} className="text-slate-400" />
    </button>
  );
}

// ---- Form field primitives (used across the enrollment form) ----

function TextField({ label, required, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
      />
    </div>
  );
}

function SelectField({ label, required, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
      >
        <option value="" disabled>
          {placeholder || `Select ${label}`}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        rows={3}
        className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
      />
    </div>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
      {label}
    </label>
  );
}

function PhoneField({ label, required, typeValue, phoneValue, onTypeChange, onPhoneChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </label>
      <div className="flex gap-2">
        <select value={typeValue} onChange={(e) => onTypeChange(e.target.value)} className="w-32 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none">
          <option>Mobile</option>
          <option>Home</option>
          <option>Work</option>
        </select>
        <input
          value={phoneValue}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Phone number"
          className="flex-1 rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
        />
      </div>
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="relative my-2 flex items-center justify-center">
      <div className="h-px w-full bg-slate-200" />
      <span className="absolute bg-white px-3 text-xs font-medium text-slate-500">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Enrollment form tabs
// ---------------------------------------------------------------------------

function PatientInformationTab({ data, update }) {
  const d = data.patient;
  const set = (field) => (val) => update("patient", field, val);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Patient Information</h3>
      <div className="grid grid-cols-2 gap-5">
        <TextField label="First Name" required value={d.firstName} onChange={set("firstName")} />
        <TextField label="Last Name" required value={d.lastName} onChange={set("lastName")} />
        <TextField label="Date of Birth" required type="date" value={d.dob} onChange={set("dob")} />
        <SelectField label="Gender" required value={d.gender} onChange={set("gender")} options={["Female", "Male", "Non-binary", "Prefer not to say"]} placeholder="Select Gender" />
        <SelectField label="Preferred Language" value={d.preferredLanguage} onChange={set("preferredLanguage")} options={["English", "Spanish", "French", "Mandarin"]} placeholder="Select Preferred Language" />
      </div>
      <SectionDivider label="Address" />
      <div className="grid grid-cols-2 gap-5">
        <TextField label="Address Line 1" required value={d.addressLine1} onChange={set("addressLine1")} placeholder="Street address" />
        <TextField label="Address Line 2" value={d.addressLine2} onChange={set("addressLine2")} placeholder="Apt, Suite, etc." />
        <TextField label="City" required value={d.city} onChange={set("city")} />
        <SelectField label="State" required value={d.state} onChange={set("state")} options={["IL", "NY", "CA", "TX", "FL"]} placeholder="Select State" />
        <TextField label="Postal Code" required value={d.zip} onChange={set("zip")} />
        <TextField label="Country" required value={d.country} onChange={set("country")} placeholder="e.g. United States" />
      </div>
    </div>
  );
}

function PatientInsuranceTab({ data, update }) {
  const d = data.insurance;
  const set = (field) => (val) => update("insurance", field, val);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Patient Insurance</h3>
      <div className="grid grid-cols-2 gap-5">
        <TextField label="Member ID (PBM Member ID / Cardholder ID)" required value={d.memberId} onChange={set("memberId")} />
        <TextField label="Primary Insurance" value={d.primaryInsurance} onChange={set("primaryInsurance")} />
        <TextField label="Primary Insurance Policy Holder" value={d.primaryPolicyHolder} onChange={set("primaryPolicyHolder")} />
        <TextField label="Primary Insurance Policy ID #" value={d.primaryPolicyId} onChange={set("primaryPolicyId")} />
        <TextField label="Group # (Primary)" value={d.primaryGroup} onChange={set("primaryGroup")} />
        <PhoneField label="Primary Insurance Phone #" typeValue={d.primaryPhoneType} phoneValue={d.primaryPhone} onTypeChange={set("primaryPhoneType")} onPhoneChange={set("primaryPhone")} />
      </div>
      <SectionDivider label="Secondary Insurance" />
      <div className="grid grid-cols-2 gap-5">
        <TextField label="Secondary Insurance" value={d.secondaryInsurance} onChange={set("secondaryInsurance")} />
        <TextField label="Secondary Insurance Policy Holder" value={d.secondaryPolicyHolder} onChange={set("secondaryPolicyHolder")} />
        <TextField label="Secondary Insurance Policy ID #" value={d.secondaryPolicyId} onChange={set("secondaryPolicyId")} />
        <TextField label="Group # (Secondary)" value={d.secondaryGroup} onChange={set("secondaryGroup")} />
        <PhoneField label="Secondary Insurance Phone #" typeValue={d.secondaryPhoneType} phoneValue={d.secondaryPhone} onTypeChange={set("secondaryPhoneType")} onPhoneChange={set("secondaryPhone")} />
      </div>
    </div>
  );
}

function PrescriberInformationTab({ data, update }) {
  const d = data.prescriber;
  const set = (field) => (val) => update("prescriber", field, val);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Prescriber Information</h3>
      <div className="grid grid-cols-2 gap-5">
        <TextField label="Account Name" value={d.accountName} onChange={set("accountName")} />
        <div />
        <TextField label="Prescriber First Name" required value={d.firstName} onChange={set("firstName")} />
        <TextField label="Prescriber Last Name" required value={d.lastName} onChange={set("lastName")} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            <span className="mr-1 text-red-500">*</span>NPI #
          </label>
          <div className="flex gap-2">
            <input value={d.npi} onChange={(e) => set("npi")(e.target.value)} placeholder="NPI #" className="flex-1 rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none" />
            <button className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-slate-50">
              <Search size={13} /> Lookup
            </button>
          </div>
        </div>
        <TextField label="State License #" value={d.stateLicense} onChange={set("stateLicense")} />
        <TextField label="Tax ID #" value={d.taxId} onChange={set("taxId")} />
        <PhoneField label="Phone #" typeValue={d.phoneType} phoneValue={d.phone} onTypeChange={set("phoneType")} onPhoneChange={set("phone")} />
        <PhoneField label="Fax #" typeValue={d.faxType} phoneValue={d.fax} onTypeChange={set("faxType")} onPhoneChange={set("fax")} />
        <TextField label="Street Address" required value={d.streetAddress} onChange={set("streetAddress")} />
        <TextField label="Suite #" value={d.suite} onChange={set("suite")} />
        <TextField label="City" required value={d.city} onChange={set("city")} />
        <SelectField label="State" required value={d.state} onChange={set("state")} options={["IL", "NY", "CA", "TX", "FL"]} placeholder="Select State" />
        <TextField label="Postal Code" required value={d.zip} onChange={set("zip")} />
        <TextField label="Country" required value={d.country} onChange={set("country")} placeholder="e.g. United States" />
      </div>
      <p className="text-xs text-slate-400">At least one of Phone # or Fax # is expected — neither is required on its own.</p>
    </div>
  );
}

function RenderingProviderTab({ data, update }) {
  const d = data.renderingProvider;
  const set = (field) => (val) => update("renderingProvider", field, val);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Rendering Provider</h3>
      <CheckboxField
        label="Rendering Provider is the same as Prescriber"
        checked={d.sameAsPrescriber}
        onChange={set("sameAsPrescriber")}
      />
      {!d.sameAsPrescriber && (
        <div className="grid grid-cols-2 gap-5">
          <TextField label="First Name" required value={d.firstName} onChange={set("firstName")} />
          <TextField label="Last Name" required value={d.lastName} onChange={set("lastName")} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              <span className="mr-1 text-red-500">*</span>NPI #
            </label>
            <div className="flex gap-2">
              <input value={d.npi} onChange={(e) => set("npi")(e.target.value)} placeholder="NPI #" className="flex-1 rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none" />
              <button className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-slate-50">
                <Search size={13} /> Lookup
              </button>
            </div>
          </div>
          <PhoneField label="Phone #" typeValue={d.phoneType} phoneValue={d.phone} onTypeChange={set("phoneType")} onPhoneChange={set("phone")} />
          <PhoneField label="Fax #" typeValue={d.faxType} phoneValue={d.fax} onTypeChange={set("faxType")} onPhoneChange={set("fax")} />
          <TextField label="Street Address" required value={d.streetAddress} onChange={set("streetAddress")} />
          <TextField label="Suite #" value={d.suite} onChange={set("suite")} />
          <TextField label="City" required value={d.city} onChange={set("city")} />
          <SelectField label="State" required value={d.state} onChange={set("state")} options={["IL", "NY", "CA", "TX", "FL"]} placeholder="Select State" />
          <TextField label="Postal Code" required value={d.zip} onChange={set("zip")} />
          <TextField label="Country" required value={d.country} onChange={set("country")} placeholder="e.g. United States" />
        </div>
      )}
      {!d.sameAsPrescriber && (
        <p className="text-xs text-slate-400">At least one of Phone # or Fax # is expected — neither is required on its own.</p>
      )}
      {d.sameAsPrescriber && (
        <p className="text-xs text-slate-400">
          Rendering Provider details will be copied from Prescriber Information at submission. Uncheck the box above to enter different details.
        </p>
      )}
    </div>
  );
}

function PharmacyTab({ data, update }) {
  const d = data.pharmacy;
  const set = (field) => (val) => update("pharmacy", field, val);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Pharmacy</h3>
      <div className="grid grid-cols-2 gap-5">
        <TextField label="NPI #" required value={d.npi} onChange={set("npi")} />
        <TextField label="NCPDP ID" required value={d.ncpdpId} onChange={set("ncpdpId")} />
        <TextField label="Business Name" required value={d.businessName} onChange={set("businessName")} />
        <div />
        <PhoneField label="Phone #" typeValue={d.phoneType} phoneValue={d.phone} onTypeChange={set("phoneType")} onPhoneChange={set("phone")} />
        <PhoneField label="Fax #" typeValue={d.faxType} phoneValue={d.fax} onTypeChange={set("faxType")} onPhoneChange={set("fax")} />
        <TextField label="Street Address" required value={d.streetAddress} onChange={set("streetAddress")} />
        <TextField label="Suite #" value={d.suite} onChange={set("suite")} />
        <TextField label="City" required value={d.city} onChange={set("city")} />
        <SelectField label="State" required value={d.state} onChange={set("state")} options={["IL", "NY", "CA", "TX", "FL"]} placeholder="Select State" />
        <TextField label="Postal Code" required value={d.zip} onChange={set("zip")} />
        <TextField label="Country" required value={d.country} onChange={set("country")} placeholder="e.g. United States" />
      </div>
      <p className="text-xs text-slate-400">At least one of Phone # or Fax # is expected — neither is required on its own.</p>
    </div>
  );
}

function DiagnosisTab({ data, update }) {
  const d = data.diagnosis;
  const set = (field) => (val) => update("diagnosis", field, val);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Diagnosis</h3>
      <TextField label="ICD-10 Code (e.g. G35 MS)" value={d.icd10} onChange={set("icd10")} placeholder="Type code or diagnosis name..." />
      <TextField label="Other Diagnosis Code" value={d.otherCode} onChange={set("otherCode")} placeholder="Type code or diagnosis name..." />
    </div>
  );
}

function PrescriptionTab({ data, update }) {
  const d = data.prescription;
  const set = (field) => (val) => update("prescription", field, val);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Prescription</h3>

      {/* Drug identification & billing */}
      <div className="grid grid-cols-3 gap-5">
        <TextField label="Drug Name (Drug Description)" required value={d.drugName} onChange={set("drugName")} />
        <TextField label="NDC (Product Code)" required value={d.ndc} onChange={set("ndc")} placeholder="e.g. 00023-1145-01" />
        <TextField label="J-Code (Billable HCPCS Code)" required value={d.jCode} onChange={set("jCode")} placeholder="e.g. J0585" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <TextField label="Quantity" required value={d.quantity} onChange={set("quantity")} />
        <TextField label="Days Supply" required value={d.daysSupply} onChange={set("daysSupply")} />
        <TextField label="Drug Administered Location" required value={d.administeredLocation} onChange={set("administeredLocation")} placeholder="e.g. Physician's Office" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <TextField label="Start Date of Service" required type="date" value={d.startDateOfService} onChange={set("startDateOfService")} />
        <TextField label="End Date of Service" required type="date" value={d.endDateOfService} onChange={set("endDateOfService")} />
        <SelectField label="Buy and Bill" required value={d.buyAndBill} onChange={set("buyAndBill")} options={["Yes", "No"]} placeholder="Select" />
      </div>

      {/* Drug details */}
      <div className="grid grid-cols-3 gap-5">
        <SelectField label="Dosage Form" value={d.dosageForm} onChange={set("dosageForm")} options={["Inhaler", "Tablet", "Injection", "Pen", "IV Infusion", "Capsule"]} placeholder="Select Dosage Form" />
        <SelectField label="Route of Administration" value={d.routeOfAdministration} onChange={set("routeOfAdministration")} options={["Inhaled", "Oral", "Subcutaneous", "Intramuscular", "Intravenous"]} placeholder="Select Route" />
        <div />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <TextField label="Strength" value={d.strength} onChange={set("strength")} />
        <SelectField label="Strength Unit" value={d.strengthUnit} onChange={set("strengthUnit")} options={["mcg/mL", "mg", "mg/mL", "mcg", "units/vial"]} placeholder="Select Unit" />
        <div />
      </div>

      <SectionDivider label="Infusion / Refill" />
      <div className="flex flex-col gap-3">
        <CheckboxField label="First Infusion Rx: 150 mg" checked={d.firstInfusion} onChange={set("firstInfusion")} />
        <CheckboxField label="Second Infusion Rx: 450 mg" checked={d.secondInfusion} onChange={set("secondInfusion")} />
        <CheckboxField label="Subsequent Infusion Rx" checked={d.subsequentInfusion} onChange={set("subsequentInfusion")} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <TextField label="Refill (Quantity)" value={d.refillQuantity} onChange={set("refillQuantity")} />
        <TextField label="Most Recently Prescribed DMT" value={d.mostRecentDMT} onChange={set("mostRecentDMT")} />
      </div>
      <TextAreaField label="Allergies" value={d.allergies} onChange={set("allergies")} />
      <CheckboxField label="Send Electronic Prescription (State Law)" checked={d.sendEPrescription} onChange={set("sendEPrescription")} />
      <TextField label="Other Diagnosis Code (if applicable)" value={d.otherDiagnosisCode} onChange={set("otherDiagnosisCode")} placeholder="Type code or diagnosis name..." />
    </div>
  );
}

function PrescriberSignatureTab({ data, update }) {
  const d = data.signature;
  const set = (field) => (val) => update("signature", field, val);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Prescriber Signature</h3>
      <div className="grid grid-cols-2 gap-5">
        <TextField label="Prescriber Name (typed signature)" value={d.certifiedName} onChange={set("certifiedName")} />
        <TextField label="Date" type="date" value={d.date} onChange={set("date")} />
      </div>
      <CheckboxField label="I certify the above information is accurate and this prescription is medically necessary." checked={d.agreed} onChange={set("agreed")} />
    </div>
  );
}

function SubmissionTab({ data, update }) {
  const d = data.submission;
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <UploadCloud size={14} className="text-indigo-500" /> Upload Consent Form (optional)
        </label>
        <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
          <UploadCloud size={13} /> Upload document (PDF only)
        </button>
      </div>
      <div className="w-64">
        <SelectField label="Urgency" required value={d.caseUrgency} onChange={(v) => update("submission", "urgency", v)} options={["Urgent", "Not Urgent"]} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Enrollment form shell (shared by New Enrollment + Update Case)
// ---------------------------------------------------------------------------

function EnrollmentForm({ mode, caseItem, enrollmentId, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(() => (mode === "create" ? emptyEnrollmentData() : mockEnrollmentDataFromCase(caseItem)));

  const update = (section, field, value) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const isLastTab = activeTab === ENROLLMENT_TABS.length - 1;
  const isViewOnly = mode === "view";
  const primaryLabel = mode === "update" ? "Update Case" : mode === "edit" ? "Save Changes" : "Create Enrollment";

  const title =
    mode === "update"
      ? `Update Case: ${caseItem?.caseId || ""}`
      : mode === "view"
      ? `Enrollment: ${enrollmentId || caseItem?.caseId || ""}`
      : mode === "edit"
      ? `Edit Enrollment: ${enrollmentId || ""}`
      : "New Enrollment";
  const subtitle =
    mode === "update"
      ? "Review and update the patient's enrollment information."
      : mode === "view"
      ? "Viewing a submitted enrollment. This record is read-only."
      : mode === "edit"
      ? "This enrollment is still in Draft — update it before submitting."
      : "Complete the patient intake form.";

  const tabContent = () => {
    switch (ENROLLMENT_TABS[activeTab]) {
      case "Patient Information":
        return <PatientInformationTab data={data} update={update} />;
      case "Patient Insurance":
        return <PatientInsuranceTab data={data} update={update} />;
      case "Prescriber Information":
        return <PrescriberInformationTab data={data} update={update} />;
      case "Rendering Provider":
        return <RenderingProviderTab data={data} update={update} />;
      case "Pharmacy":
        return <PharmacyTab data={data} update={update} />;
      case "Diagnosis":
        return <DiagnosisTab data={data} update={update} />;
      case "Prescription":
        return <PrescriptionTab data={data} update={update} />;
      case "Prescriber Signature":
        return <PrescriberSignatureTab data={data} update={update} />;
      case "Submission":
        return <SubmissionTab data={data} update={update} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header — no top-level Programme selector */}
      <div className="flex items-start gap-3">
        <button onClick={onBack} className="mt-1 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-0">
        <div className="flex gap-6 overflow-x-auto border-b border-slate-200 px-5">
          {ENROLLMENT_TABS.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`whitespace-nowrap border-b-2 py-3.5 text-sm font-medium transition ${
                idx === activeTab ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={`p-6 ${isViewOnly ? "pointer-events-none opacity-70" : ""}`}>{tabContent()}</div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
          {isViewOnly ? (
            <button onClick={onBack} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Close
            </button>
          ) : (
            <>
              <button
                disabled={activeTab === 0}
                onClick={() => setActiveTab((t) => Math.max(0, t - 1))}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Back
              </button>
              {isLastTab ? (
                <>
                  <button className="rounded-md border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                    Save as Draft
                  </button>
                  <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{primaryLabel}</button>
                </>
              ) : (
                <>
                  <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Save</button>
                  <button onClick={() => setActiveTab((t) => Math.min(ENROLLMENT_TABS.length - 1, t + 1))} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    Next
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------

function DashboardScreen({ onNewEnrollment, onViewTasks }) {
  const ACTION_HANDLERS = {
    "New Enrollment": onNewEnrollment,
    "View Tasks": onViewTasks,
  };

  const totalCases = CASE_TRACKING_ROWS.length;
  const ongoingCases = CASE_TRACKING_ROWS.filter((c) => c.status === "Open").length;
  const closedCases = totalCases - ongoingCases;
  const awaitingTasks = TASKS.filter((t) => t.status === "Pending").length;

  const kpis = [
    { label: "Total Cases", value: totalCases, sub: "Overall caseload" },
    { label: "Ongoing Cases", value: ongoingCases, sub: "Open" },
    { label: "Awaiting Tasks", value: awaitingTasks, sub: `${TASKS.length} total tasks` },
    { label: "Closed Cases", value: closedCases, sub: "Closed" },
  ];

  // The 5 most recently created cases -- CASE_TRACKING_ROWS is already
  // ordered most-recent-first, matching Case Tracking's own default sort.
  const recentCases = CASE_TRACKING_ROWS.slice(0, 5);

  const [caseIdFilter, setCaseIdFilter] = useState("");
  const [memberIdFilter, setMemberIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredCases = recentCases.filter((c) => {
    if (caseIdFilter && !c.caseId.toLowerCase().includes(caseIdFilter.toLowerCase())) return false;
    if (memberIdFilter && !(ENROLLMENTS.find((e) => e.caseId === c.caseId)?.enrollmentId || "").toLowerCase().includes(memberIdFilter.toLowerCase())) return false;
    if (nameFilter && !c.patient.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (statusFilter !== "All Statuses" && getCaseStatusInfo(c).label !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="px-4 py-4">
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{k.value}</p>
            <p className="mt-1 text-[11px] text-slate-400">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Card
              key={a.label}
              onClick={ACTION_HANDLERS[a.label]}
              className="flex cursor-pointer items-center gap-3 px-4 py-4 transition hover:border-indigo-300 hover:shadow-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                <Icon size={16} className="text-indigo-600" />
              </span>
              <span>
                <p className="text-sm font-medium text-slate-900">{a.label}</p>
                <p className="text-xs text-slate-400">{a.sub}</p>
              </span>
            </Card>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Cases</h2>
          <span className="text-xs text-slate-400">5 most recently created \u2014 matches Case Tracking</span>
        </div>

        {/* Filtering happens live as you type/select -- no Apply/Clear step */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-3">
          <div className="flex w-36 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
            <Search size={12} className="text-slate-400" />
            <input value={caseIdFilter} onChange={(e) => setCaseIdFilter(e.target.value)} placeholder="Case ID (e.g. 41)" className="w-full text-xs text-slate-600 placeholder:text-slate-400 outline-none" />
          </div>
          <div className="flex w-44 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
            <Search size={12} className="text-slate-400" />
            <input value={memberIdFilter} onChange={(e) => setMemberIdFilter(e.target.value)} placeholder="Enrollment ID (e.g. ENR-0062)" className="w-full text-xs text-slate-600 placeholder:text-slate-400 outline-none" />
          </div>
          <div className="flex w-44 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
            <Search size={12} className="text-slate-400" />
            <input value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder="Patient Name (e.g. Charlie Lovejoy)" className="w-full text-xs text-slate-600 placeholder:text-slate-400 outline-none" />
          </div>
          <div className="flex w-48 items-center justify-between gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-transparent text-xs text-slate-600 outline-none">
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={12} className="text-slate-400" />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-100 text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Case ID</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Enrollment ID</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Patient Name</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c, idx) => (
                <tr key={c.caseId} className={`${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} cursor-pointer hover:bg-indigo-50/40`}>
                  <td className="px-4 py-3 font-medium text-indigo-600">{c.caseId}</td>
                  <td className="px-4 py-3 text-slate-600">{ENROLLMENTS.find((e) => e.caseId === c.caseId)?.enrollmentId || "\u2014"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.patient}</td>
                  <td className="px-4 py-3">
                    <CaseStatusBadge caseItem={c} />
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400">No cases match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Task Progress</h3>
            <button className="text-xs font-medium text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="mt-3 flex flex-col items-center gap-2">
            <ProgressRing percent={100} color="#5145E5" />
            <p className="text-sm font-bold text-slate-900">100% On Time</p>
          </div>
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <p>Overdue: 0</p>
            <p>Due Today: 0</p>
            <p>Due This Week: 0</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Case Metrics</h3>
            <button className="text-xs font-medium text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="mt-3 flex flex-col items-center gap-2">
            <ProgressRing percent={94} color="#28B473" />
            <p className="text-sm font-bold text-slate-900">94% Active</p>
          </div>
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <p>Open Cases: 17</p>
            <p>Closed: 1</p>
            <p>Processed: 0</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function EnrollmentsListScreen({ onNew, onView, onEdit }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enrollments</h1>
          <p className="mt-1 text-sm text-slate-500">Track and manage patient enrollment submissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterSelect label="All Statuses" />
          <button onClick={onNew} className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={15} /> New Enrollment
          </button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Enrollment ID</th>
              <th className="px-4 py-3 font-semibold">Case ID</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Urgency</th>
              <th className="px-4 py-3 font-semibold">Created At</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ENROLLMENTS.map((row, idx) => {
              const hasCase = row.caseId && row.caseId !== "—";
              return (
                <tr key={row.enrollmentId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <PatientAvatar name={row.patient === "—" ? "??" : row.patient} colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
                      <span className="font-medium text-slate-800">{row.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{row.enrollmentId}</span>
                  </td>
                  <td className="px-4 py-3">
                    {hasCase ? (
                      <span className="inline-block rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">{row.caseId}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <EnrollmentStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <UrgencyBadge urgency={row.caseUrgency} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onView(row)} title="View enrollment" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
                        <Eye size={15} />
                      </button>
                      {row.status === "Draft" && (
                        <button onClick={() => onEdit(row)} title="Edit draft enrollment" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
                          <Pencil size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>1–10 of 21 enrollments</span>
          <div className="flex items-center gap-1.5">
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronLeft size={13} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 font-medium text-indigo-600">1</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500">2</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500">3</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            Rows per page
            <span className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1">
              10 <ChevronDown size={11} />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TaskStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${TASK_STATUS_STYLES[status] || TASK_STATUS_STYLES.Pending}`}>
      {status}
    </span>
  );
}

function TasksScreen({ onOpenCoreDeepLink, onOpenCase }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">Review and complete pending tasks assigned to you.</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterSelect label="Status" />
          <FilterSelect label="All Urgencies" />
          <FilterSelect label="All Dates" />
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Case ID</th>
              <th className="px-4 py-3 font-semibold">Patient Name</th>
              <th className="px-4 py-3 font-semibold">Urgency</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Due Date</th>
              <th className="px-4 py-3 font-semibold">Created At</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {TASKS.map((t, idx) => {
              const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === t.caseId);
              const hasCase = Boolean(linkedCase);
              const isPA = t.type === "pa_questions" || t.type === "pa_status";
              return (
                <tr key={`${t.title}-${idx}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-800">{t.title}</td>
                  <td className="px-4 py-3 text-slate-500">{t.type}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">{t.caseId}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{linkedCase ? linkedCase.patient : "\u2014"}</td>
                  <td className="px-4 py-3">
                    <UrgencyBadge urgency={t.caseUrgency} />
                  </td>
                  <td className="px-4 py-3">
                    <TaskStatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{t.dueDate}</td>
                  <td className="px-4 py-3 text-slate-500">{t.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title="Acknowledge" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300">
                        <CheckCircle2 size={15} />
                      </button>
                      <button
                        onClick={() => isPA && onOpenCoreDeepLink(t.caseId, t.type === "pa_questions" ? "questions" : "status")}
                        disabled={!isPA}
                        title={isPA ? "Open in Core" : "Not wired up in this demo"}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${
                          isPA ? "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" : "cursor-default text-slate-200"
                        }`}
                      >
                        <PlayCircle size={15} />
                      </button>
                      <button
                        onClick={() => hasCase && onOpenCase(t.caseId)}
                        disabled={!hasCase}
                        title={hasCase ? "Open linked case" : "No linked case"}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${
                          hasCase ? "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" : "cursor-default text-slate-200"
                        }`}
                      >
                        <FolderOpen size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>1–{TASKS.length} of {TASKS.length} tasks</span>
          <div className="flex items-center gap-1.5">
            Rows per page
            <span className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1">
              10 <ChevronDown size={11} />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ---- Core PA screen building blocks ----

function PentagonStep({ index, total, label, active, visited, onClick, interactive = true }) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  let clipPath;
  if (isFirst) clipPath = "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)";
  else if (isLast) clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%, 12% 50%)";
  else clipPath = "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%, 12% 50%)";

  const toneClass = active ? "bg-indigo-600 text-white" : visited ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400";
  const content = (
    <>
      <span>{index + 1}</span>
      <span className="whitespace-nowrap">{label}</span>
    </>
  );

  if (!interactive) {
    return (
      <div style={{ clipPath }} className={`flex min-w-[168px] items-center gap-2 px-6 py-3 text-xs font-semibold ${toneClass}`}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ clipPath }}
      className={`flex min-w-[168px] items-center gap-2 px-6 py-3 text-xs font-semibold transition ${toneClass} ${
        active ? "" : visited ? "hover:bg-indigo-200" : "hover:bg-slate-200"
      }`}
    >
      {content}
    </button>
  );
}

function EmptyPlaceholder({ text }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 text-center">
      <p className="max-w-sm px-6 text-sm text-slate-400">{text}</p>
    </div>
  );
}

// ---- Stage 1: Data & Intake — read-only snapshot of what was captured at enrollment ----

const DATA_INTAKE_TABS = ENROLLMENT_TABS.slice(0, ENROLLMENT_TABS.length - 2); // drop Prescriber Signature + Submission

function DataIntakeStage({ caseItem }) {
  const [tabIdx, setTabIdx] = useState(0);
  const data = mockEnrollmentDataFromCase(caseItem);
  const noop = () => {};

  const renderTab = () => {
    switch (DATA_INTAKE_TABS[tabIdx]) {
      case "Patient Information":
        return <PatientInformationTab data={data} update={noop} />;
      case "Patient Insurance":
        return <PatientInsuranceTab data={data} update={noop} />;
      case "Prescriber Information":
        return <PrescriberInformationTab data={data} update={noop} />;
      case "Diagnosis":
        return <DiagnosisTab data={data} update={noop} />;
      case "Prescription":
        return <PrescriptionTab data={data} update={noop} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Data & Intake</h3>
        <p className="mt-0.5 text-xs text-slate-500">Everything captured for this patient at the time of enrollment. Read-only.</p>
      </div>
      <div className="flex gap-6 overflow-x-auto border-b border-slate-200">
        {DATA_INTAKE_TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setTabIdx(idx)}
            className={`whitespace-nowrap border-b-2 py-3 text-sm font-medium ${idx === tabIdx ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="pointer-events-none pt-2 opacity-80">{renderTab()}</div>
    </div>
  );
}

// ---- Stage 2: Coverage Determination — pass/fail eligibility outcome ----

function CoverageDeterminationStage({ caseItem }) {
  const passed = caseItem.eligibilityStatus === "success";
  const pending = caseItem.eligibilityStatus === "pending";
  const style = pending
    ? "border-slate-300 bg-slate-100 text-slate-600"
    : passed
    ? "border-green-200 bg-green-50 text-green-600"
    : "border-red-200 bg-red-50 text-red-600";
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-slate-50 px-6 py-14 text-center">
      <span className={`flex h-14 w-14 items-center justify-center rounded-full border ${style}`}>
        {pending ? <Clock size={26} /> : passed ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
      </span>
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${style}`}>
        {pending ? "Awaiting Questionnaire \u2014 Eligibility & Benefit Investigation in progress" : passed ? "Eligibility check successful - Patient has Valid Insurance" : `Eligibility Failed \u2014 ${caseItem.eligibilityFailureReason || "Reason not specified"}`}
      </span>
      <p className="max-w-sm text-xs text-slate-500">
        {pending
          ? "Agadia is still running Eligibility Check and Benefit Investigation for this case. This status updates automatically once a determination is returned."
          : passed
          ? "This case is cleared to move forward to Benefits Investigation."
          : "This case cannot proceed until the eligibility issue is resolved — see Case Tracking for details."}
      </p>
    </div>
  );
}

function BenefitInvestigationStage({ caseItem }) {
  const required = caseItem.paRequired === true;
  const style = required ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-slate-300 bg-slate-100 text-slate-600";
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-900">Benefits Investigation</h3>
      <div className="flex flex-col items-center gap-4 rounded-lg bg-slate-50 px-6 py-14 text-center">
        <span className={`flex h-14 w-14 items-center justify-center rounded-full border ${style}`}>
          {required ? <Flag size={26} /> : <MinusCircle size={26} />}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${style}`}>
          {required ? "PA is Required for this case" : "PA is Not Required for this case"}
        </span>
      </div>
    </div>
  );
}

// ---- Stage 4: Prior Authorization — Clinical Questions + PA Status live here together ----

function ClinicalQuestionsTab({ questions }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [uploads, setUploads] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const fileInputRef = useRef(null);

  const isLast = qIndex === questions.length - 1;
  const canProceed = answers[qIndex].trim().length > 0;
  const answeredCount = answers.filter((a) => a.trim().length > 0).length;

  const setAnswer = (val) => {
    const next = [...answers];
    next[qIndex] = val;
    setAnswers(next);
    setDraftSaved(false);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const next = [...uploads];
      next[qIndex] = file.name;
      setUploads(next);
      setDraftSaved(false);
    }
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-emerald-50 px-6 py-10 text-center">
        <CheckCircle2 className="text-emerald-600" size={32} />
        <p className="text-sm font-semibold text-emerald-700">Answers submitted to Agadia</p>
        <p className="max-w-sm text-xs text-emerald-600">
          The payer will review your responses. This is asynchronous — check the PA Status tab for updates, and you'll receive a "PA Status" task once a determination is available.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900">Clinical Information</h4>
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          Question {qIndex + 1} of {questions.length}
        </span>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">Question {qIndex + 1} (from Agadia)</p>
        <p className="mb-3 text-sm font-medium text-slate-800">{questions[qIndex].text}</p>
        <input
          value={answers[qIndex]}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here"
          className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-slate-400">Your answer determines which question is asked next.</p>
      </div>

      {!isLast && (
        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-center text-xs text-slate-400">
          Question {qIndex + 2} stays hidden until Question {qIndex + 1} is answered
        </div>
      )}

      {/* Upload available at the bottom of every question, not just the last one */}
      <div className="rounded-lg bg-slate-50 px-4 py-3.5">
        <p className="mb-2 text-xs font-medium text-slate-600">Upload supplementary document (optional)</p>
        <div className="flex items-center gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <UploadCloud size={13} /> Choose file
          </button>
          <span className="text-xs text-slate-400">{uploads[qIndex] || "No file selected"}</span>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          disabled={qIndex === 0}
          onClick={() => setQIndex((i) => Math.max(0, i - 1))}
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          Back
        </button>
        <div className="flex items-center gap-2.5">
          {draftSaved && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 size={13} /> Progress saved ({answeredCount} of {questions.length} answered)
            </span>
          )}
          <button onClick={handleSaveDraft} className="rounded-md border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
            Save as Draft
          </button>
          {isLast ? (
            <button
              disabled={!canProceed}
              onClick={() => setSubmitted(true)}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
            >
              Submit Answers
          </button>
        ) : (
          <button
            disabled={!canProceed}
            onClick={() => setQIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            Next
          </button>
        )}
        </div>
      </div>
    </div>
  );
}

function PALetterOverlay({ status, onClose }) {
  const letters = {
    Approved: (
      <>
        <p>07/29/2026</p>
        <p>Demo Test<br />9 campus<br />parsippany, NJ 07054</p>
        <p><strong>RE:</strong> Approval for OZEMPIC 0.25-0.5 MG/DOSE PEN</p>
        <p>Dear Scot Lovejoy:</p>
        <p>Health Plan Inc. has approved OZEMPIC 0.25-0.5 MG/DOSE PEN from 07/29/2026 to 07/29/2026 as requested by Scot Lovejoy.</p>
        <p>Health Plan Inc. will pay for this requested medication. You may be charged a copay for this medication.</p>
        <p>Please call us if you have any questions about your benefits. Our Member Relations department is always ready to help you. You can call 24 hours a day, 7 days a week. Please call 973-540-8400.</p>
        <p>Sincerely,</p>
        <p>Health Plan Inc. Pharmacy Department</p>
        <p className="mt-6 text-xs text-slate-500">cc: Scot Lovejoy<br />9 Campus Dr<br />Parsippany, NJ 07054</p>
      </>
    ),
    Denied: (
      <>
        <p>07/29/2026</p>
        <p><strong>RE:</strong> Demo Test (03/28/1985)</p>
        <p>Demo Test<br />9 campus<br />parsippany, NJ 07054</p>
        <p>Dear Scot Lovejoy</p>
        <p>Health Plan has reviewed the request to approve the prescription for OZEMPIC 0.25-0.5 MG/DOSE PEN submitted by you on behalf of Demo Test, Health Plan number Mem1985 on 05/21/2026. After Physician review, the request is denied completely.</p>
        <p>This decision will take effect on 07/29/2026.</p>
        <p className="font-semibold">To continue getting services</p>
        <p>If you have been receiving the medicine that is being reduced, changed, or denied and you file a complaint, grievance, or request for a fair hearing that is postmarked or hand-delivered within 10 days of the date on this notice, the prescription will continue until a decision is made.</p>
        <p className="font-semibold">IF YOU DO NOT AGREE WITH THIS DECISION, YOU MAY DO ONE OR ALL OF THE FOLLOWING:</p>
        <p>1) Request a copy of the medical necessity criteria the decision was based on by writing to the Health Plan &amp; Grievance Department, 9 Campus Drive, 2nd Floor East, Parsippany, NJ 07054.</p>
        <p>2) File a complaint or grievance with Health Plan within 45 days of this notice by calling (973) 540-8400.</p>
        <p>3) Request a fair hearing from the Department of Public Welfare, in writing, postmarked within 30 days of this notice.</p>
        <p>Sincerely,</p>
        <p>Health Plan</p>
        <p className="mt-6 text-xs text-slate-500">cc: Scot Lovejoy<br />9 Campus Dr<br />Parsippany, NJ 07054</p>
      </>
    ),
    "Partially Approved": (
      <>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">ABCCOMM14976ABC Commercial Client — TRAINING TEAM DO NOT EDIT</p>
        <p>07/29/2026</p>
        <p>Demo Test<br />9 campus<br />parsippany, NJ 07054</p>
        <p>Member ID: Mem1985</p>
        <p><strong>RE:</strong> Approval for ACTEMRA 162 MG/0.9 ML SYRINGE</p>
        <p>Dear Demo Test:</p>
        <p>Health Plan, Inc. has partially approved ACTEMRA 162 MG/0.9 ML SYRINGE from 07/29/2026 to 07/29/2026 as requested by Scot Lovejoy.</p>
        <p>Your request was partially denied for the following reasons:</p>
        <p>Please call us if you have any questions about your benefits. Our Member Relations department is always ready to help you. You can call 24 hours a day, 7 days a week. Please call 973-540-8400.</p>
        <p>Sincerely,</p>
        <p>Health Plan Pharmacy Department</p>
        <p className="mt-6 text-xs text-slate-500">cc: Scot Lovejoy<br />9 Campus Dr Suite 200<br />Parsippany, NJ 07054</p>
      </>
    ),
    "Plan Needs More Information": (
      <>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">ABCCOMM14976ABC Commercial Client — TRAINING TEAM DO NOT EDIT</p>
        <p>07/29/2026</p>
        <p>Demo Test<br />9 campus<br />parsippany, NJ 07054</p>
        <p>Member ID: Mem1985</p>
        <p><strong>RE:</strong> Additional Information Needed for ACTEMRA 162 MG/0.9 ML SYRINGE</p>
        <p>Dear Demo Test:</p>
        <p>Health Plan, Inc. has reviewed the request for ACTEMRA 162 MG/0.9 ML SYRINGE submitted on your behalf by Scot Lovejoy, and is unable to complete this review without additional information.</p>
        <p>The following is needed before a determination can be made:</p>
        <p>Please ask your prescriber to submit the requested information within 14 days of the date of this notice. If it is not received within that time, this request will be closed and a new request will need to be submitted.</p>
        <p>Please call us if you have any questions about your benefits. Our Member Relations department is always ready to help you. You can call 24 hours a day, 7 days a week. Please call 973-540-8400.</p>
        <p>Sincerely,</p>
        <p>Health Plan Pharmacy Department</p>
        <p className="mt-6 text-xs text-slate-500">cc: Scot Lovejoy<br />9 Campus Dr Suite 200<br />Parsippany, NJ 07054</p>
      </>
    ),
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6">
      <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <p className="text-sm font-bold text-slate-800">Determination Letter</p>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-10 py-8 text-sm leading-relaxed text-slate-800" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          <p className="mb-5 text-2xl font-bold text-blue-600">
            Agadia<span className="text-amber-500">.</span>
          </p>
          {letters[status]}
        </div>
      </div>
    </div>
  );
}

function PAStatusTab({ caseItem }) {
  const [showLetter, setShowLetter] = useState(false);
  const status = caseItem.paStatus;
  const isDecided = Boolean(status);

  const drugInfoHeader = caseItem.drugName && (
    <div className="mb-4 flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-3">
      <Pill size={15} className="text-indigo-500" />
      <span className="text-sm font-semibold text-slate-800">{caseItem.drugName}</span>
      <span className="text-sm text-slate-400">—</span>
      <span className="text-sm text-slate-600">{caseItem.routeOfAdministration || "—"}</span>
      <span className="ml-auto text-[11px] text-slate-400">Collected at enrollment</span>
    </div>
  );

  if (!isDecided) {
    const { label } = getCaseStatusInfo(caseItem);
    const styleKey = label === "Awaiting Questionnaire" ? "Awaiting Questionnaire" : label === "Awaiting Response" ? "Awaiting Response" : "Case Under Plan Review";
    const style = PA_STATUS_STYLES[styleKey] || PA_STATUS_STYLES["Case Under Plan Review"];
    const Icon = style.icon;
    return (
      <>
        {drugInfoHeader}
        <div className="flex flex-col items-center gap-4 rounded-lg bg-slate-50 px-6 py-14 text-center">
          <span className={`flex h-14 w-14 items-center justify-center rounded-full border ${style.pill}`}>
            <Icon size={26} />
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${style.pill}`}>{label === "Cases Under Plan Review" ? "Case Under Plan Review" : label}</span>
        </div>
      </>
    );
  }

  const style = PA_STATUS_STYLES[status] || PA_STATUS_STYLES["Case Under Plan Review"];
  const fieldLabel = (label) => (
    <span className="group relative inline-flex items-center gap-1">
      {label}
      <Info size={11} className="cursor-help text-slate-300 hover:text-slate-500" />
      <span className="pointer-events-none absolute bottom-full left-0 z-10 mb-1.5 hidden min-h-[24px] w-56 rounded-md bg-slate-800 px-2.5 py-1.5 text-[11px] font-normal leading-snug text-white shadow-lg group-hover:block">
        {PA_FIELD_DESCRIPTIONS[label] || ""}
      </span>
    </span>
  );
  const row = (label, value) => (
    <div className="flex flex-col gap-0.5 py-2.5">
      <span className="text-xs text-slate-400">{fieldLabel(label)}</span>
      <span className="text-sm text-slate-800">{value ?? "—"}</span>
    </div>
  );
  return (
    <>
      {drugInfoHeader}
      <div className="rounded-lg border border-slate-200">
        <div className="grid grid-cols-2 gap-x-8 divide-y divide-slate-100 px-5 [&>*:nth-child(odd)]:border-r [&>*:nth-child(odd)]:border-slate-100 [&>*:nth-child(odd)]:pr-8">
          {row("Urgency", caseItem.urgency)}
          {row("Estimated End Date & Time", caseItem.estimatedEndDate)}
          {row("Date & Time Created", caseItem.dateCreated)}
          {row("Review Submitted Date & Time", caseItem.reviewSubmittedDate)}
          {row("Date & Time Closed", caseItem.dateClosed)}
          <div className="flex flex-col gap-0.5 py-2.5">
            <span className="text-xs text-slate-400">{fieldLabel("Status/Decision")}</span>
            <button onClick={() => setShowLetter(true)} className={`text-left text-sm font-semibold underline ${style.pill.split(" ").find((c) => c.startsWith("text-"))}`}>
              {status}
            </button>
          </div>
          {row("Authorization ID", caseItem.authorizationId)}
          {row("Authorization Start Date", caseItem.authStartDate)}
          {row("Authorization End Date", caseItem.authEndDate)}
          {row("Approved Quantity", caseItem.approvedQuantity)}
          {row("Approved Days Supply", caseItem.approvedDaysSupply)}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          <FileText size={13} />
          Click the status above to view the determination letter the plan sent to the provider.
        </div>
      </div>
      {showLetter && <PALetterOverlay status={status} onClose={() => setShowLetter(false)} />}
    </>
  );
}

function UploadedDocumentOverlay({ filename, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6">
      <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <FileText size={15} className="text-indigo-500" />
            {filename}
          </p>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3 overflow-y-auto bg-slate-100 px-10 py-14 text-center">
          <div className="flex h-40 w-32 flex-col items-center justify-center gap-2 rounded-md border border-slate-300 bg-white shadow-sm">
            <FileText size={32} className="text-slate-300" />
            <span className="text-[10px] text-slate-400">PDF Preview</span>
          </div>
          <p className="text-xs text-slate-500">
            This is a placeholder preview. In the live product, this panel renders the actual uploaded file uploaded alongside this answer.
          </p>
        </div>
      </div>
    </div>
  );
}

function ClinicalQuestionsReadOnly({ questions, answers, documents, status }) {
  const [viewingDoc, setViewingDoc] = useState(null);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
        These clinical questions were already answered and submitted to Agadia. This case's status is <span className="font-semibold">{status}</span> — responses are read-only.
      </div>
      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-md border border-slate-200 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Question {idx + 1}</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{q.text}</p>
          <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">{answers[idx]}</p>
          {documents && documents[idx] && (
            <button
              onClick={() => setViewingDoc(documents[idx])}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
            >
              <FileText size={12} /> View Document
            </button>
          )}
        </div>
      ))}
      {viewingDoc && <UploadedDocumentOverlay filename={viewingDoc} onClose={() => setViewingDoc(null)} />}
    </div>
  );
}

function PriorAuthorizationStage({ caseItem, initialSubTab }) {
  const [subTab, setSubTab] = useState(initialSubTab || "questions");
  const isDecided = Boolean(caseItem.paStatus);

  if (!caseItem.paRequired) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900">Prior Authorization</h3>
        <EmptyPlaceholder text="Prior Authorization is not required for this case — there is nothing to review here." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Prior Authorization</h3>
      </div>
      <div className="flex gap-6 border-b border-slate-200">
        <button
          onClick={() => setSubTab("questions")}
          className={`whitespace-nowrap border-b-2 py-3 text-sm font-medium ${subTab === "questions" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Clinical Questions
        </button>
        <button
          onClick={() => setSubTab("status")}
          className={`whitespace-nowrap border-b-2 py-3 text-sm font-medium ${subTab === "status" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          PA Status
        </button>
      </div>
      <div className="pt-2">
        {subTab === "questions" ? (
          isDecided ? (
            <ClinicalQuestionsReadOnly questions={PA_QUESTIONS} answers={PA_QUESTION_ANSWERS} documents={PA_QUESTION_DOCUMENTS} status={caseItem.paStatus} />
          ) : (
            <ClinicalQuestionsTab questions={PA_QUESTIONS} />
          )
        ) : (
          <PAStatusTab caseItem={caseItem} />
        )}
      </div>
    </div>
  );
}

// ---- Screen shell: pentagon stepper is fully free-navigation across all 6 stages ----

function CorePAScreen({ caseItem, initialTab, initialStage, onBack }) {
  // Deep links from Tasks always land on the Prior Authorization pentagon (index 3) by default —
  // Clinical Questions vs PA Status is just which sub-tab opens within it. Browsing in from the
  // Cases list instead starts at Data & Intake (index 0).
  const [activeStage, setActiveStage] = useState(initialStage !== undefined ? initialStage : 3);

  const renderStageContent = () => {
    switch (activeStage) {
      case 0:
        return <DataIntakeStage caseItem={caseItem} />;
      case 1:
        return <CoverageDeterminationStage caseItem={caseItem} />;
      case 2:
        return <BenefitInvestigationStage caseItem={caseItem} />;
      case 3:
        return <PriorAuthorizationStage caseItem={caseItem} initialSubTab={initialTab} />;
      case 4:
        return <EmptyPlaceholder text="PA Review hasn't started for this case yet." />;
      case 5:
        return <EmptyPlaceholder text="No appeals have been filed for this case." />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Case Details</h1>
          <p className="text-xs text-slate-500">{caseItem.caseId}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Workflow — click any stage to move freely</p>
        <div className="flex overflow-x-auto">
          {CORE_STAGE_LABELS.map((label, idx) => (
            <div key={label} className={idx > 0 ? "-ml-3" : ""}>
              <PentagonStep index={idx} total={CORE_STAGE_LABELS.length} label={label} active={idx === activeStage} visited={idx < activeStage} onClick={() => setActiveStage(idx)} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card className="col-span-1 p-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {caseItem.patient.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </span>
            <p className="text-sm font-semibold text-slate-900">{caseItem.patient}</p>
            <div className="flex gap-1.5">
              <OpenStatusBadge />
              <UrgencyBadge urgency={caseItem.caseUrgency || "Not Urgent"} />
            </div>
            <p className="text-xs text-slate-400">{caseItem.caseId}</p>
          </div>
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-xs">
            <div>
              <p className="text-slate-400">Opened</p>
              <p className="font-medium text-slate-700">{caseItem.enrollmentDate ? caseItem.enrollmentDate.split(" ").slice(0, 3).join(" ") : "Jun 28, 2026"}</p>
            </div>
          </div>
        </Card>

        <Card className="col-span-3 p-6">{renderStageContent()}</Card>
      </div>
    </div>
  );
}

const GENDER_STYLES = {
  Female: "border-pink-200 bg-pink-50 text-pink-600",
  Male: "border-blue-200 bg-blue-50 text-blue-600",
  Unknown: "border-slate-200 bg-slate-100 text-slate-500",
};

function GenderBadge({ gender }) {
  return <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${GENDER_STYLES[gender] || GENDER_STYLES.Unknown}`}>{gender}</span>;
}

function PatientStatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
      <CheckCircle2 size={12} /> {status}
    </span>
  );
}

function CorePatientsScreen({ onView }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Patients</h1>
        <p className="mt-1 text-sm text-slate-500">Search, view, and manage patient records.</p>
      </div>
      <div className="flex w-72 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">
        <Search size={13} />
        <span>Search by name or MRN...</span>
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">MRN</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Date of Birth</th>
              <th className="px-4 py-3 font-semibold">Gender</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PATIENTS.map((p, idx) => (
              <tr key={p.mrn} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <PatientAvatar name={p.name} colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
                    <span className="font-medium text-slate-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">{p.mrn}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  <p>{p.email}</p>
                  <p className="text-xs text-slate-400">{p.phone}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{p.dob}</td>
                <td className="px-4 py-3">
                  <GenderBadge gender={p.gender} />
                </td>
                <td className="px-4 py-3">
                  <PatientStatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onView(p)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>1–{PATIENTS.length} of 24 patients</span>
          <div className="flex items-center gap-1.5">
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronLeft size={13} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-blue-200 bg-blue-50 font-medium text-blue-600">1</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500">2</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500">3</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CorePatientDetailScreen({ patient, onBack, onOpenCase }) {
  const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === patient.caseId);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button onClick={onBack} className="mt-1 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {patient.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-slate-900">{patient.name}</p>
                <PatientStatusBadge status={patient.status} />
              </div>
              <p className="text-xs text-slate-400">
                MRN: {patient.mrn} · DOB {patient.dob} · {patient.gender}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Phone</p>
            <p className="text-sm font-medium text-slate-700">{patient.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Email</p>
            <p className="text-sm font-medium text-slate-700">{patient.email}</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Pencil size={13} /> Edit Patient
          </button>
        </div>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users size={14} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Demographics & Contact</h2>
        </div>
        <div className="grid grid-cols-2 gap-y-4">
          <InfoField icon={CheckCircle2} label="Status">
            <PatientStatusBadge status={patient.status} />
          </InfoField>
          <InfoField icon={FileText} label="MRN">
            {patient.mrn}
          </InfoField>
          <InfoField icon={Clock} label="Date of Birth">
            {patient.dob}
          </InfoField>
          <InfoField icon={Users} label="Gender">
            {patient.gender}
          </InfoField>
        </div>
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-14 text-xs text-slate-400">Phone</span>
            <span className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-500">mobile</span>
            <span className="text-slate-700">{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-14 text-xs text-slate-400">Email</span>
            <span className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-500">personal</span>
            <span className="text-slate-700">{patient.email}</span>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Plus size={14} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Enrolments</h2>
        </div>
        {patient.enrolmentId ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 font-semibold">Enrolment #</th>
                <th className="py-2 font-semibold">Channel</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 font-semibold">Referral Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 font-medium text-emerald-700">{patient.enrolmentId}</td>
                <td className="py-3 text-slate-500">{linkedCase?.intakeChannel || "API"}</td>
                <td className="py-3">
                  <EnrollmentStatusBadge status="Accepted" />
                </td>
                <td className="py-3 text-slate-400">No data</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <EmptyPlaceholder text="No enrolments on file for this patient." />
        )}
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <FolderOpen size={14} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Cases</h2>
        </div>
        {linkedCase ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 font-semibold">Case #</th>
                <th className="py-2 font-semibold">Source</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 font-semibold">Stage</th>
                <th className="py-2 font-semibold">Urgency</th>
                <th className="py-2 font-semibold">Opened</th>
                <th className="py-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 font-medium text-indigo-600">{linkedCase.caseId}</td>
                <td className="py-3 text-slate-500">{linkedCase.intakeChannel}</td>
                <td className="py-3">
                  <OpenStatusBadge />
                </td>
                <td className="py-3 text-slate-500">{CORE_STAGE_LABELS[getCoreStageIndex(linkedCase)]}</td>
                <td className="py-3">
                  <UrgencyBadge urgency={linkedCase.caseUrgency} />
                </td>
                <td className="py-3 text-slate-500">{linkedCase.enrollmentDate.split(" ").slice(0, 3).join(" ")}</td>
                <td className="py-3 text-right">
                  <button onClick={() => onOpenCase(linkedCase.caseId)} className="text-xs font-medium text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <EmptyPlaceholder text="No cases on file for this patient." />
        )}
      </Card>
    </div>
  );
}

function CoreCasesScreen({ onView }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Cases</h1>
        <p className="mt-1 text-sm text-slate-500">All cases synced from the Enrollment Portal.</p>
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Case ID</th>
              <th className="px-4 py-3 font-semibold">Urgency</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {CASE_TRACKING_ROWS.map((row, idx) => (
              <tr key={row.caseId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <PatientAvatar name={row.patient} colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
                    <span className="font-medium text-slate-800">{row.patient}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">{row.caseId}</span>
                </td>
                <td className="px-4 py-3">
                  <UrgencyBadge urgency={row.caseUrgency} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onView(row)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function CorePortalShell({ children, activeNavLabel, onNavClick, navItems, backLabel, onBack, onBackToPartner, onLogout, userEmail, userName }) {
  return (
    <div className="min-h-screen w-full bg-[#F8F9FB] font-sans text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-blue-600" />
          <div>
            <p className="text-sm font-bold leading-tight">AnvayaRx</p>
            <p className="text-[11px] leading-tight text-slate-500">Core Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600">
            <ChevronLeft size={13} /> {backLabel}
          </button>
          <button onClick={onBackToPartner} className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600">
            <ChevronLeft size={13} /> Partner ABC
          </button>
          <button onClick={onLogout} title="Log out" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <LogOut size={15} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <Bell size={16} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-blue-600" />
            <div>
              <p className="text-xs font-medium leading-tight">{userName}</p>
              <p className="text-[10px] leading-tight text-slate-400">{userEmail}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="flex w-52 flex-col gap-1 border-r border-slate-200 bg-white p-3">
          {(navItems || CORE_NAV_ITEMS).map((label) => {
            const isActive = label === activeNavLabel;
            return (
              <button
                key={label}
                onClick={() => onNavClick(label)}
                className={`rounded-lg px-3 py-2.5 text-left text-sm transition ${isActive ? "bg-blue-50 font-medium text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {label}
              </button>
            );
          })}
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function CaseTrackingScreen({ onView }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Case Tracking</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor and manage all active patient cases.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">
            <Search size={13} />
            <span>Search patient</span>
          </div>
          <FilterSelect label="All Statuses" />
          <FilterSelect label="All Stages" />
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Case ID</th>
              <th className="px-4 py-3 font-semibold">Stage</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Urgency</th>
              <th className="px-4 py-3 font-semibold">SLA Due</th>
              <th className="px-4 py-3 font-semibold">Enrollment Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {CASE_TRACKING_ROWS.map((row, idx) => (
              <tr key={row.caseId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <PatientAvatar name={row.patient} colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
                    <span className="font-medium text-slate-800">{row.patient}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">{row.caseId}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{CORE_STAGE_LABELS[getCoreStageIndex(row)]}</td>
                <td className="px-4 py-3">
                  <CaseStatusBadge caseItem={row} />
                </td>
                <td className="px-4 py-3">
                  <UrgencyBadge urgency={row.caseUrgency} />
                </td>
                <td className="px-4 py-3">
                  <SlaCell date={row.slaDue} overdue={row.overdue} />
                </td>
                <td className="px-4 py-3 text-slate-500">{row.enrollmentDate}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onView(row)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" title="View case">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>1–10 of 18 cases</span>
          <div className="flex items-center gap-1.5">
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronLeft size={13} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 font-medium text-indigo-600">1</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500">2</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            Rows per page
            <span className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1">
              10 <ChevronDown size={11} />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfoField({ icon: Icon, label, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-400">
        <Icon size={12} /> {label}
      </p>
      <div className="mt-1.5 text-sm font-medium text-slate-800">{children}</div>
    </div>
  );
}



function CaseDetailScreen({ caseItem, onBack, onUpdateCase }) {
  const activeStageIndex = getCoreStageIndex(caseItem);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button onClick={onBack} className="mt-1 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Case : {caseItem.caseId}</h1>
            <p className="mt-1 text-sm text-slate-500">View case details, stage progress, and associated patient information.</p>
          </div>
        </div>
        {caseItem.eligibilityStatus === "failed" && (
          <button onClick={onUpdateCase} className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Pencil size={14} /> Update Case
          </button>
        )}
      </div>

      <Card className="px-6 py-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Workflow</p>
        <div className="flex overflow-x-auto">
          {CORE_STAGE_LABELS.map((label, idx) => (
            <div key={label} className={idx > 0 ? "-ml-3" : ""}>
              <PentagonStep index={idx} total={CORE_STAGE_LABELS.length} label={label} active={idx === activeStageIndex} visited={idx < activeStageIndex} interactive={false} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Case Information</h2>
        </div>
        <div className="grid grid-cols-4 gap-y-6">
          <InfoField icon={FileText} label="Case Number">{caseItem.caseId}</InfoField>
          <InfoField icon={Users} label="Patient">{caseItem.patient}</InfoField>
          <InfoField icon={ShieldAlert} label="Status">
            <CaseStatusBadge caseItem={caseItem} showReason />
          </InfoField>

          <InfoField icon={Flag} label="Workflow Stage">{CORE_STAGE_LABELS[getCoreStageIndex(caseItem)]}</InfoField>
          <InfoField icon={Flag} label="Urgency">
            <UrgencyBadge urgency={caseItem.caseUrgency} />
          </InfoField>
          <InfoField icon={Clock} label="SLA Status">
            {caseItem.overdue ? <span className="text-red-500">Overdue</span> : <span className="text-green-600">On Track</span>}
          </InfoField>
          <InfoField icon={Clock} label="SLA Due">{caseItem.slaDue} 4:46 PM</InfoField>

          <InfoField icon={Clock} label="Enrollment Date">{caseItem.enrollmentDate}</InfoField>
          <InfoField icon={Clock} label="Created">{caseItem.enrollmentDate}</InfoField>
          <InfoField icon={Clock} label="Last Updated">Jun 28, 2026 4:47 PM</InfoField>
        </div>
      </Card>
    </div>
  );
}

function ComingSoonScreen({ label }) {
  return (
    <div className="flex h-[560px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-xs text-slate-400">This screen is coming up next in the wireframe walkthrough.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell (header + sidebar) + router
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Login / SSO hand-off screen — gates access to the portal before Dashboard
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Partner SSO flow — Partner ABC login → Partner dashboard → SSO mediator → AnvayaRx (or Access Denied)
// ---------------------------------------------------------------------------

const PARTNER_ACCOUNTS = {
  "xyz@yopmail.com": { password: "Admin@123", hasAnvayaRxAccess: true, displayName: "Xyz Test" },
  "pqr@yopmail.com": { password: "Admin@123", hasAnvayaRxAccess: false, displayName: "Pqr Test" },
};

function PartnerLoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const key = username.trim().toLowerCase();
    const account = PARTNER_ACCOUNTS[key];
    if (account && account.password === password) {
      setError("");
      onLogin(key);
    } else {
      setError("Incorrect username or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      {/* Left branding panel — deliberately distinct from AnvayaRx's look, since this is a different company's software */}
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 px-16 md:flex">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div className="relative z-10 max-w-md text-white">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-300">
            <Building2 size={12} /> Demo Partner Environment
          </div>
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20">
              <Building2 size={20} className="text-teal-300" />
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">Partner ABC</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold leading-snug">Sign in to your Partner ABC workspace.</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            This is a mock environment representing a partner organization, where the AnvayaRx application is embedded and launched via single sign-on.
          </p>
        </div>
      </div>

      {/* Right sign-in panel */}
      <div className="flex w-full items-center justify-center px-6 md:w-1/2">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-5 flex w-fit items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Illustrative Partner Portal — Demo Only
          </div>
          <h2 className="text-center text-lg font-bold text-slate-900">Sign in to Partner ABC</h2>
          <p className="mt-1 text-center text-xs text-slate-400">A placeholder for your organization's own single sign-on workspace</p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Username or email</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 pr-9 text-sm text-slate-700 focus:border-teal-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && <p className="-mt-1 text-xs font-medium text-red-500">{error}</p>}
            <button onClick={handleSubmit} className="rounded-md bg-slate-800 py-2.5 text-sm font-semibold text-white hover:bg-slate-900">
              Sign In
            </button>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-[11px] text-slate-400">Partner ABC — mock environment for demo purposes</div>
        </div>
      </div>
    </div>
  );
}

const PARTNER_APPS = [
  { name: "AnvayaRx", description: "Specialty pharmacy enrollment & prior authorization", icon: Layers, launchable: true },
  { name: "Feature 1", description: "Placeholder — not part of this demo", icon: FileText, launchable: false },
  { name: "Feature 2", description: "Placeholder — not part of this demo", icon: Users, launchable: false },
  { name: "Feature 3", description: "Placeholder — not part of this demo", icon: ClipboardList, launchable: false },
];

function PartnerDashboardScreen({ email, onLaunchAnvayaRx }) {
  const account = PARTNER_ACCOUNTS[email];
  return (
    <div className="min-h-screen w-full bg-slate-100">
      <div className="bg-teal-600 px-6 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
        Demo Partner Environment — Illustrative Only, Not a Real Product
      </div>
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/20">
            <Building2 size={18} className="text-teal-300" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-white">Partner ABC</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-xs font-semibold text-teal-300">
            {(account?.displayName || email).charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-xs font-medium leading-tight text-white">{account?.displayName || email}</p>
            <p className="text-[10px] leading-tight text-slate-400">{email}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-xl font-bold text-slate-900">Welcome back, {account?.displayName?.split(" ")[0] || "there"}</h1>
        <p className="mt-1 text-sm text-slate-500">
          This is a mock environment of a partner where the AnvayaRx app is embedded. Only AnvayaRx is functional below — the rest are unlabeled placeholders standing in for whatever else a partner's real portal might contain.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {PARTNER_APPS.map((app) => {
            const Icon = app.icon;
            return (
              <div key={app.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                    <Icon size={20} className="text-slate-600" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{app.name}</p>
                    <p className="text-xs text-slate-400">{app.description}</p>
                  </div>
                </div>
                {app.launchable ? (
                  <button
                    onClick={onLaunchAnvayaRx}
                    className="flex items-center gap-1.5 rounded-md bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-900"
                  >
                    Launch <ArrowRight size={13} />
                  </button>
                ) : (
                  <button disabled className="rounded-md border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-300">
                    Launch
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function SSOMediatorScreen({ onComplete }) {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 1600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
          <div className="h-5 w-5 rounded-md bg-white" />
        </div>
        <Loader2 size={28} className="animate-spin text-indigo-500" />
        <div>
          <p className="text-sm font-semibold text-slate-900">Authenticating with AnvayaRx</p>
          <p className="mt-1 text-xs text-slate-400">Verifying your access via Partner ABC single sign-on...</p>
        </div>
      </div>
    </div>
  );
}

function AccessDeniedScreen({ email, onBack }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
          <ShieldAlert size={26} />
        </span>
        <div>
          <p className="text-base font-bold text-slate-900">You do not have access to AnvayaRx</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {email} is signed in to Partner ABC, but isn't provisioned for AnvayaRx. Please contact your Partner Admin to request access.
          </p>
        </div>
        <button onClick={onBack} className="mt-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">
          Back to Partner ABC
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Core, entered directly from the module selector (not via a Task deep-link).
// Has its own Cases/Patients browsing state and a "‹ Modules" back button,
// alongside the persistent "‹ Partner ABC" / Logout exit.
// ---------------------------------------------------------------------------

const USER_ROLE_OPTIONS = ["All Portal Admin", "Enrollment Admin", "All Portal User", "Enrollment User"];

const PARTNER_ENROLLMENT_USERS = [
  { id: "abc-u1", name: "Testuser One", role: "All Portal Admin", email: "muskan3011kumari@gmail.com", status: "Active", invited: "Jul 8, 2026" },
  { id: "abc-u2", name: "Aa Aa", role: "Enrollment Admin", email: "sb6qnxmmir@ozsaip.com", status: "Active", invited: "Jun 27, 2026" },
  { id: "abc-u3", name: "Aa Aa", role: "All Portal User", email: "sb6qnxmmir@ozsaip.com", status: "Active", invited: "Jun 27, 2026" },
  { id: "abc-u4", name: "Test Test", role: "Enrollment User", email: "bokog59490@adsprite.com", status: "Active", invited: "Jun 24, 2026" },
  { id: "abc-u5", name: "Emma Mark", role: "Enrollment Admin", email: "john.anderson_55@yopmail.com", status: "Active", invited: "Jun 23, 2026" },
  { id: "abc-u6", name: "Mas Mas", role: "Enrollment User", email: "mas@d.com", status: "Active", invited: "Jun 21, 2026" },
  { id: "abc-u7", name: "Pqr Test", role: "All Portal Admin", email: "pqr@yopmail.com", status: "Active", invited: "Jun 15, 2026" },
  { id: "abc-u8", name: "Jay Bafna", role: "All Portal User", email: "jaybafna@yopmail.com", status: "Active", invited: "Jun 14, 2026" },
  { id: "abc-u9", name: "Abc", role: "Enrollment Admin", email: "abc@yopmail.com", status: "Active", invited: "Jun 10, 2026" },
  { id: "abc-u10", name: "Xyz Test", role: "All Portal Admin", email: "xyz@yopmail.com", status: "Active", invited: "Jun 10, 2026" },
];

// Only reachable at all once AnvayaRx Admin has enabled self-service user
// management for this Partner (PARTNER_USER_MANAGEMENT_ENABLED above) --
// otherwise Core's nav never offers a Users tab in the first place. Once
// enabled, this is the same screen, same Invite User flow, and same data
// the AnvayaRx Admin already manages on this Partner's behalf (Section 4.2.2)
// -- the Partner is now doing it themselves instead.
function PartnerUsersScreen() {
  const [users, setUsers] = useState(PARTNER_ENROLLMENT_USERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Enrollment User");
  const [editingId, setEditingId] = useState(null);
  const [editingRole, setEditingRole] = useState("Enrollment User");

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) return;
    const name = inviteEmail.split("@")[0].replace(/[._]/g, " ");
    setUsers((prev) => [
      { id: `u-${Date.now()}`, name: name.charAt(0).toUpperCase() + name.slice(1), role: inviteRole, email: inviteEmail.trim(), status: "Invited", invited: "Just now" },
      ...prev,
    ]);
    setInviteEmail("");
    setInviteRole("Enrollment User");
    setShowInvite(false);
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditingRole(user.role);
  };

  const saveEdit = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: editingRole } : u)));
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Manage user accounts and their access across the application, by assigning each one a role.</p>
        </div>
        <button
          onClick={() => setShowInvite((s) => !s)}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <UserPlus size={15} /> Invite User
        </button>
      </div>

      {showInvite && (
        <Card className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1 min-w-[220px]">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Email address</label>
            <input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <div className="w-48">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              {USER_ROLE_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSendInvite} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Send Invite
          </button>
          <button onClick={() => setShowInvite(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Invited</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <PatientAvatar name={u.name} colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
                    <span className="font-medium text-slate-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {editingId === u.id ? (
                    <select
                      value={editingRole}
                      onChange={(e) => setEditingRole(e.target.value)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-400 focus:outline-none"
                    >
                      {USER_ROLE_OPTIONS.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">{u.role}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">{u.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{u.invited}</td>
                <td className="px-4 py-3 text-right">
                  {editingId === u.id ? (
                    <button onClick={() => saveEdit(u.id)} className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700">
                      Save
                    </button>
                  ) : (
                    <button onClick={() => startEdit(u)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-amber-50 hover:text-amber-600">
                      <Pencil size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function CoreModuleApp({ userEmail, userName, onGoToModules, onBackToPartner, onLogout }) {
  const [coreState, setCoreState] = useState({ screen: "cases" });

  const navLabelForScreen = { cases: "Cases", "case-detail": "Cases", patients: "Patients", "patient-detail": "Patients", users: "Users" };
  const screenKeyForLabel = { Cases: "cases", Patients: "patients", Users: "users" };

  let coreContent;
  if (coreState.screen === "users") {
    coreContent = <PartnerUsersScreen />;
  } else if (coreState.screen === "patients") {
    coreContent = <CorePatientsScreen onView={(p) => setCoreState({ screen: "patient-detail", mrn: p.mrn })} />;
  } else if (coreState.screen === "patient-detail") {
    const patient = PATIENTS.find((p) => p.mrn === coreState.mrn);
    coreContent = (
      <CorePatientDetailScreen
        patient={patient}
        onBack={() => setCoreState({ screen: "patients" })}
        onOpenCase={(caseId) => setCoreState({ screen: "case-detail", caseId })}
      />
    );
  } else if (coreState.screen === "cases") {
    coreContent = <CoreCasesScreen onView={(c) => setCoreState({ screen: "case-detail", caseId: c.caseId })} />;
  } else {
    const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === coreState.caseId) || { caseId: coreState.caseId, patient: "Unknown Patient", caseUrgency: "Not Urgent" };
    coreContent = (
      <CorePAScreen caseItem={linkedCase} initialTab={coreState.tab} initialStage={coreState.tab ? 3 : 0} onBack={() => setCoreState({ screen: "cases" })} />
    );
  }

  return (
    <CorePortalShell
      activeNavLabel={navLabelForScreen[coreState.screen]}
      onNavClick={(label) => setCoreState({ screen: screenKeyForLabel[label] || "cases" })}
      backLabel="Modules"
      onBack={onGoToModules}
      onBackToPartner={onBackToPartner}
      onLogout={onLogout}
      userEmail={userEmail}
      userName={userName}
    >
      {coreContent}
    </CorePortalShell>
  );
}

// ---------------------------------------------------------------------------
// Module selector — the home screen once inside AnvayaRx. Partner users only
// ever see 2 modules (Enrollment Portal, Core) — Govern is Admin-only, not
// shown here at all.
// ---------------------------------------------------------------------------

const PARTNER_MODULE_TILES = [
  {
    key: "enrollment-portal",
    name: "Enrollment Portal",
    category: "PARTNER-FACING PORTAL",
    accent: "border-t-purple-500",
    icon: UserPlus,
    description: "Submit patient enrollments, track case status, and manage intake workflows.",
  },
  {
    key: "core",
    name: "AnvayaRx Core",
    category: "HUB OPERATIONS",
    accent: "border-t-blue-500",
    icon: Layers,
    description: "The operational backbone of the hub ecosystem — coverage, authorization, and fulfillment for every case.",
  },
];

function ModuleSelectorScreen({ userEmail, userName, onSelect, onBackToPartner, onLogout }) {
  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
            <Layers size={16} className="text-white" />
          </div>
          <p className="text-base font-bold text-slate-800">
            Anvaya<span className="text-emerald-600">Rx</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-400">
            <Search size={13} />
            <span>Search workspaces...</span>
          </div>
          <button onClick={onBackToPartner} title="Back to Partner ABC" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <ChevronLeft size={15} />
          </button>
          <button onClick={onLogout} title="Log out" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <LogOut size={15} />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 text-xs font-semibold text-white">
              {(userName || "A").charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-xs font-medium leading-tight text-slate-800">{userName}</p>
              <p className="text-[10px] leading-tight text-slate-400">{userEmail}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid grid-cols-2 gap-5">
          {PARTNER_MODULE_TILES.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.key} className={`flex flex-col justify-between rounded-lg border border-t-4 border-slate-200 bg-white ${m.accent} p-5 shadow-sm`}>
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                    <Icon size={18} className="text-slate-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{m.name}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{m.category}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{m.description}</p>
                </div>
                <button onClick={() => onSelect(m.key)} className="mt-4 flex items-center gap-1 self-start text-xs font-semibold text-indigo-600 hover:underline">
                  Launch Portal <ArrowRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <div className="border-t border-slate-100 py-4 text-center text-[11px] text-slate-400">POWERED BY Agadia</div>
    </div>
  );
}

function AnvayaRxApp({ userEmail, userName, onGoToModules, onBackToPartner, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [selectedCase, setSelectedCase] = useState(null);
  const [enrollmentMode, setEnrollmentMode] = useState(null); // null | "create" | "update" | "view"
  const [enrollmentCase, setEnrollmentCase] = useState(null);
  const [viewingEnrollmentId, setViewingEnrollmentId] = useState(null);
  // null | { screen: "dashboard" | "patients" | "cases" | "tasks" | "case-detail", caseId?, tab? }
  const [coreState, setCoreState] = useState(null);

  const activeLabel = NAV_ITEMS.find((n) => n.key === active)?.label || "";

  const handleNavClick = (key) => {
    setActive(key);
    setSelectedCase(null);
    setEnrollmentMode(null);
    setEnrollmentCase(null);
    setViewingEnrollmentId(null);
    setCoreState(null);
  };

  const openCoreDeepLink = (caseId, tab) => {
    setCoreState({ screen: "case-detail", caseId, tab });
  };

  const handleViewEnrollment = (enrollmentRow) => {
    const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === enrollmentRow.caseId);
    setEnrollmentCase(linkedCase || { patient: enrollmentRow.patient, caseId: enrollmentRow.caseId, caseUrgency: enrollmentRow.caseUrgency });
    setViewingEnrollmentId(enrollmentRow.enrollmentId);
    setEnrollmentMode("view");
  };

  const handleEditEnrollment = (enrollmentRow) => {
    const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === enrollmentRow.caseId);
    setEnrollmentCase(linkedCase || { patient: enrollmentRow.patient, caseId: enrollmentRow.caseId, caseUrgency: enrollmentRow.caseUrgency });
    setViewingEnrollmentId(enrollmentRow.enrollmentId);
    setEnrollmentMode("edit");
  };

  const handleOpenLinkedCase = (caseId) => {
    const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === caseId);
    if (!linkedCase) return;
    setActive("case-tracking");
    setSelectedCase(linkedCase);
    setEnrollmentMode(null);
    setEnrollmentCase(null);
    setCoreState(null);
  };

  let content;
  if (active === "dashboard") {
    content = (
      <DashboardScreen
        onNewEnrollment={() => {
          setActive("enrollment");
          setEnrollmentMode("create");
        }}
        onViewTasks={() => handleNavClick("tasks")}
      />
    );
  } else if (active === "enrollment") {
    if (enrollmentMode === "create") {
      content = <EnrollmentForm mode="create" caseItem={null} onBack={() => setEnrollmentMode(null)} />;
    } else if (enrollmentMode === "view") {
      content = (
        <EnrollmentForm
          mode="view"
          caseItem={enrollmentCase}
          enrollmentId={viewingEnrollmentId}
          onBack={() => {
            setEnrollmentMode(null);
            setEnrollmentCase(null);
            setViewingEnrollmentId(null);
          }}
        />
      );
    } else if (enrollmentMode === "edit") {
      content = (
        <EnrollmentForm
          mode="edit"
          caseItem={enrollmentCase}
          enrollmentId={viewingEnrollmentId}
          onBack={() => {
            setEnrollmentMode(null);
            setEnrollmentCase(null);
            setViewingEnrollmentId(null);
          }}
        />
      );
    } else {
      content = <EnrollmentsListScreen onNew={() => setEnrollmentMode("create")} onView={handleViewEnrollment} onEdit={handleEditEnrollment} />;
    }
  } else if (active === "case-tracking") {
    if (enrollmentMode === "update") {
      content = (
        <EnrollmentForm
          mode="update"
          caseItem={enrollmentCase}
          onBack={() => {
            setEnrollmentMode(null);
            setEnrollmentCase(null);
          }}
        />
      );
    } else if (selectedCase) {
      content = (
        <CaseDetailScreen
          caseItem={selectedCase}
          onBack={() => setSelectedCase(null)}
          onUpdateCase={() => {
            setEnrollmentMode("update");
            setEnrollmentCase(selectedCase);
          }}
        />
      );
    } else {
      content = <CaseTrackingScreen onView={(c) => setSelectedCase(c)} />;
    }
  } else if (active === "tasks") {
    content = <TasksScreen onOpenCoreDeepLink={openCoreDeepLink} onOpenCase={handleOpenLinkedCase} />;
  } else {
    content = <ComingSoonScreen label={activeLabel} />;
  }

  if (coreState) {
    const navLabelForScreen = { cases: "Cases", "case-detail": "Cases", patients: "Patients", "patient-detail": "Patients" };
    const screenKeyForLabel = { Cases: "cases", Patients: "patients" };

    let coreContent;
    if (coreState.screen === "patients") {
      coreContent = <CorePatientsScreen onView={(p) => setCoreState({ screen: "patient-detail", mrn: p.mrn })} />;
    } else if (coreState.screen === "patient-detail") {
      const patient = PATIENTS.find((p) => p.mrn === coreState.mrn);
      coreContent = (
        <CorePatientDetailScreen
          patient={patient}
          onBack={() => setCoreState({ screen: "patients" })}
          onOpenCase={(caseId) => setCoreState({ screen: "case-detail", caseId })}
        />
      );
    } else if (coreState.screen === "cases") {
      coreContent = <CoreCasesScreen onView={(c) => setCoreState({ screen: "case-detail", caseId: c.caseId })} />;
    } else {
      const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === coreState.caseId) || { caseId: coreState.caseId, patient: "Unknown Patient", caseUrgency: "Not Urgent" };
      coreContent = (
        <CorePAScreen
          caseItem={linkedCase}
          initialTab={coreState.tab}
          initialStage={coreState.tab ? 3 : 0}
          onBack={() => setCoreState({ screen: "cases" })}
        />
      );
    }

    return (
      <CorePortalShell
        activeNavLabel={navLabelForScreen[coreState.screen]}
        onNavClick={(label) => setCoreState({ screen: screenKeyForLabel[label] || "cases" })}
        navItems={["Cases", "Patients"]}
        backLabel="Enrollment Portal"
        onBack={() => setCoreState(null)}
        onBackToPartner={onBackToPartner}
        onLogout={onLogout}
        userEmail={userEmail}
        userName={userName}
      >
        {coreContent}
      </CorePortalShell>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8F9FB] font-sans text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-indigo-600" />
          <div>
            <p className="text-sm font-bold leading-tight">AnvayaRx</p>
            <p className="text-[11px] leading-tight text-slate-500">Enrollment Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onGoToModules} className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600">
            <ChevronLeft size={13} /> Modules
          </button>
          <button onClick={onBackToPartner} className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600">
            <ChevronLeft size={13} /> Partner ABC
          </button>
          <button onClick={onLogout} title="Log out" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <LogOut size={15} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <Bell size={16} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-indigo-600" />
            <div>
              <p className="text-xs font-medium leading-tight">{userName}</p>
              <p className="text-[10px] leading-tight text-slate-400">{userEmail}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="flex w-56 flex-col gap-1 border-r border-slate-200 bg-white p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isActive ? "bg-indigo-100 font-medium text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <main className="flex-1 p-6">{content}</main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top-level flow controller: Partner ABC login -> Partner dashboard ->
// SSO mediator -> AnvayaRx (or Access Denied), depending on the logged-in
// partner user's provisioning.
// ---------------------------------------------------------------------------

export default function PartnerSSODemo() {
  // "partner-login" | "partner-dashboard" | "sso-mediator" | "access-denied" | "modules" | "enrollment-portal" | "core"
  const [stage, setStage] = useState("partner-login");
  const [currentEmail, setCurrentEmail] = useState("");

  if (stage === "partner-login") {
    return (
      <PartnerLoginScreen
        onLogin={(email) => {
          setCurrentEmail(email);
          setStage("partner-dashboard");
        }}
      />
    );
  }

  if (stage === "partner-dashboard") {
    return <PartnerDashboardScreen email={currentEmail} onLaunchAnvayaRx={() => setStage("sso-mediator")} />;
  }

  if (stage === "sso-mediator") {
    return (
      <SSOMediatorScreen
        onComplete={() => {
          const account = PARTNER_ACCOUNTS[currentEmail];
          setStage(account?.hasAnvayaRxAccess ? "modules" : "access-denied");
        }}
      />
    );
  }

  if (stage === "access-denied") {
    return <AccessDeniedScreen email={currentEmail} onBack={() => setStage("partner-dashboard")} />;
  }

  const account = PARTNER_ACCOUNTS[currentEmail];
  const userEmail = currentEmail;
  const userName = account?.displayName || currentEmail;
  const goToModules = () => setStage("modules");
  const backToPartner = () => setStage("partner-dashboard");
  const logout = () => {
    setCurrentEmail("");
    setStage("partner-login");
  };

  if (stage === "modules") {
    return (
      <ModuleSelectorScreen
        userEmail={userEmail}
        userName={userName}
        onSelect={(key) => setStage(key)}
        onBackToPartner={backToPartner}
        onLogout={logout}
      />
    );
  }

  if (stage === "core") {
    return <CoreModuleApp userEmail={userEmail} userName={userName} onGoToModules={goToModules} onBackToPartner={backToPartner} onLogout={logout} />;
  }

  return (
    <AnvayaRxApp
      userEmail={userEmail}
      userName={userName}
      onGoToModules={goToModules}
      onBackToPartner={backToPartner}
      onLogout={logout}
    />
  );
}
