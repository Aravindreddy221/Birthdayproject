import React, { useState, useRef, useEffect } from "react";
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
  Send,
  Mail,
  MessageSquare,
  Lock,
  ShieldCheck,
  User,
  FileSpreadsheet,
  Download,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static demo data
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "enrollment", label: "Enrollment", icon: UserPlus },
  { key: "case-status", label: "Case Status", icon: ClipboardList },
  { key: "tasks", label: "Task", icon: CheckSquare },
  { key: "reports", label: "Reports", icon: FileSpreadsheet },
  { key: "users", label: "Users", icon: Users },
];

const QUICK_ACTIONS = [
  { label: "New Enrollment", sub: "Create patient", icon: FilePlus2 },
  { label: "View Tasks", sub: "Follow-up", icon: ListChecks },
];



const STATUS_OPTIONS = ["All Statuses", "Awaiting Questionnaire", "Awaiting Response", "Awaiting Prescriber Input", "Under Payer Review", "PA Not Required", "Approved", "Partially Approved", "Denied", "Payer Needs More Information", "Coverage Determination Failed"];

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

// The full set of reasons Agadia can return for why a case could not be created —
// every one of these is a real, specific reason, never a generic fallback. Each entry
// carries Agadia's own error code, its internal description, and the customer-facing
// message a Partner actually sees. "Coverage Determination Failed" always uses one of the
// eligibility-specific (CD) entries below; there is no scenario where the reason is
// left unspecified.
const AGADIA_CASE_CREATION_ERRORS = [
  { code: "BY", internal: "The drug is not covered under the medical benefit.", message: "The drug requested is not covered under the medical benefit." },
  { code: "CD", internal: "The member does not exist in the requested health plan.", message: "Member eligibility not found." },
  { code: "CD", internal: "The member does not have active eligibility with the requested health plan.", message: "The member does not have active eligibility with the requested health plan." },
  { code: "CD", internal: "Multiple eligible records are returned for the requested patient.", message: "Eligibility could not be verified for this patient as multiple patients were found. Please review patient information." },
  { code: "CC", internal: "A Prior Authorization is not required for this request.", message: "A Prior Authorization is not required." },
  { code: "CF", internal: "An Authorization is already on file for this request.", message: "Authorization already on file for this request." },
  { code: "BX", internal: "No product or clinical criteria is found and the default ePA Product is either missing or inactive.", message: "This request cannot be processed electronically." },
  { code: "BY", internal: "Question set (PARequest) was submitted once and an outcome already exists for this request.", message: "A final determination has been reached for this request." },
  { code: "BY", internal: "A request is submitted from a prescribing system while the same PA is open in PAHub.", message: "The PA is currently being locked/held by another user." },
  { code: "CG", internal: "There is a duplicate PA in the system with the same patient, prescriber, and drug for this request. This criteria can vary depending on the customer needs.", message: "There is an existing PA within the PA system that has the same patient, prescriber, and drug. This PA must be finalized before proceeding with similar PAs." },
  { code: "BY", internal: "An issue occurred while processing the prescriber details.", message: "Verify the prescriber details. [More details will be provided if available]" },
  { code: "BY", internal: "An issue occurred while processing the medication details.", message: "Verify the medication details. [More details will be provided if available]" },
];

const CASE_TRACKING_ROWS = [
  { patient: "Mini Mouse", memberId: "MEM19850041", caseId: "CASE-00041", payerName: "Anthem Inc", programme: "Botox drug program", stage: "Prior Authorization", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 28, 2026", overdue: true, enrollmentDate: "Jun 28, 2026 2:46 PM", eligibilityStatus: "success", paRequired: true, questionsSubmitted: false, intakeChannel: "Embedded UI", prescriberName: "Amit Kapoor", pharmacyName: "Meridian Infusion Pharmacy", prescriberEmail: "amit.kapoor@example.com", prescriberPhone: "(555) 212-9034", requiresPrescriberSubmission: true },
  { patient: "Mickey Mouse", memberId: "MEM19850040", caseId: "CASE-00040", prescriberName: "Dr. Neha Kapadia", pharmacyName: "Meridian Infusion Pharmacy", payerName: "BCBS NJ", programme: "Botox drug program", stage: "Data & Intake", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 28, 2026", overdue: true, enrollmentDate: "Jun 28, 2026 1:20 PM", eligibilityStatus: "failed", eligibilityFailureReason: "Member eligibility not found.", paRequired: false, intakeChannel: "API" },
  { patient: "Madmax G Madmax", memberId: "MEM19850038", caseId: "CASE-00038", payerName: "Cigna Pharmacy Services", programme: "Bonofide", stage: "Prior Authorization", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 28, 2026", overdue: true, enrollmentDate: "Jun 27, 2026 9:01 PM", paStatus: "Approved", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "API", drugName: "ACTEMRA 162 MG/0.9 ML SYRINGE", routeOfAdministration: "Subcutaneous", prescriberName: "Scot Lovejoy", pharmacyName: "CarePoint Specialty Pharmacy", urgency: "Not Urgent", dateCreated: "06/27/2026 21:01:00", reviewSubmittedDate: "06/27/2026 21:45:12", dateClosed: "07/29/2026 14:42:16", estimatedEndDate: "08/04/2026 21:01:00", createdBy: "Aravind Reddy", authStartDate: "07/29/2026", authEndDate: "07/29/2026", authorizationId: "AUTH-8827461", approvedQuantity: "1 Syringe", approvedDaysSupply: "28 days" },
  { patient: "Disney World", memberId: "MEM19850035", caseId: "CASE-00035", payerName: "Humana", programme: "Sun Tech", stage: "Benefits Investigation", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jul 1, 2026", overdue: true, enrollmentDate: "Jun 24, 2026 10:35 AM", paStatus: "Denied", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "Embedded UI", drugName: "OZEMPIC 0.25-0.5 MG/DOSE PEN", routeOfAdministration: "Subcutaneous", prescriberName: "Scot Lovejoy", servicingProviderName: "Dr. Renee Castillo", pharmacyName: "Woodville Home Infusion", urgency: "Not Urgent", dateCreated: "06/24/2026 10:35:00", reviewSubmittedDate: "06/24/2026 11:20:44", dateClosed: "07/29/2026 14:27:54", estimatedEndDate: "—", createdBy: "Aravind Reddy", authStartDate: "—", authEndDate: "—", authorizationId: "AUTH-8827398", denialReason: "the medication does not meet the plan\u2019s step therapy requirements" },
  { patient: "Santosh Test Nair", memberId: "MEM19850034", caseId: "CASE-00034", prescriberName: "Dr. Marcus Ellery", pharmacyName: "CarePoint Specialty Pharmacy", payerName: "Kaiser Permanente", programme: "Bonofide", stage: "Data & Intake", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 24, 2026", overdue: false, enrollmentDate: "Jun 24, 2026 9:56 AM", eligibilityStatus: "pending", intakeChannel: "API" },
  { patient: "Priya Sharma", memberId: "MEM19850036", caseId: "CASE-00036", prescriberName: "Dr. Sofia Reyes", pharmacyName: "Woodville Home Infusion", payerName: "Health Partners", programme: "Sun Tech", stage: "Coordination", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 26, 2026", overdue: false, enrollmentDate: "Jun 25, 2026 11:12 AM", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "Embedded UI" },
  { patient: "Carlos Mendez", memberId: "MEM19850033", caseId: "CASE-00033", prescriberName: "Dr. Trevor Diallo", pharmacyName: "Lakeside Specialty Rx", payerName: "Geisinger Health Plan", programme: "Sun Tech", stage: "Enrollment", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 24, 2026", overdue: true, enrollmentDate: "Jun 24, 2026 3:55 AM", eligibilityStatus: "failed", eligibilityFailureReason: "The member does not have active eligibility with the requested health plan.", paRequired: false, intakeChannel: "Embedded UI" },
  { patient: "Jack Mark", memberId: "MEM19850032", caseId: "CASE-00032", prescriberName: "Dr. Lena Kowalski", pharmacyName: "Meridian Infusion Pharmacy", payerName: "Anthem Inc", programme: "Sun Tech", stage: "Treatment Scheduling", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jun 28, 2026", overdue: true, enrollmentDate: "Jun 24, 2026 3:54 AM", eligibilityStatus: "failed", eligibilityFailureReason: "Eligibility could not be verified for this patient as multiple patients were found. Please review patient information.", paRequired: false, intakeChannel: "API" },
  { patient: "Jackson Smith", memberId: "MEM19850031", caseId: "CASE-00031", payerName: "BCBS NJ", programme: "Bonofide", stage: "Coordination", status: "Open", caseUrgency: "Urgent", slaDue: "Jul 5, 2026", overdue: true, enrollmentDate: "Jun 23, 2026 4:47 PM", paStatus: "Partially Approved", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "Embedded UI", drugName: "HUMIRA 40 MG/0.4 ML PEN", routeOfAdministration: "Subcutaneous", prescriberName: "Scot Lovejoy", pharmacyName: "Lakeside Specialty Rx", urgency: "Not Urgent", dateCreated: "06/23/2026 16:47:00", reviewSubmittedDate: "06/23/2026 17:30:08", dateClosed: "07/29/2026 14:35:41", estimatedEndDate: "10/27/2026 16:47:00", createdBy: "Aravind Reddy", authStartDate: "07/29/2026", authEndDate: "10/27/2026", authorizationId: "AUTH-8827412", approvedQuantity: "2 Pens", approvedDaysSupply: "90 days", partialReason: "quantity approved is limited to a 3-month supply pending re-authorization" },
  { patient: "Krish Watson", memberId: "MEM19850030", caseId: "CASE-00030", payerName: "Cigna Pharmacy Services", programme: "Bonofide", stage: "Coordination", status: "Open", caseUrgency: "Urgent", slaDue: "Jun 23, 2026", overdue: true, enrollmentDate: "Jun 23, 2026 4:28 PM", paStatus: "Payer Needs More Information", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "API", drugName: "ACTEMRA 162 MG/0.9 ML SYRINGE", routeOfAdministration: "Subcutaneous", prescriberName: "Scot Lovejoy", pharmacyName: "Meridian Infusion Pharmacy", urgency: "Not Urgent", dateCreated: "06/23/2026 16:28:00", reviewSubmittedDate: "06/23/2026 17:10:22", estimatedEndDate: "—", createdBy: "Aravind Reddy", authStartDate: "—", authEndDate: "—", authorizationId: "AUTH-8827455", moreInfoRequested: "additional chart notes documenting the patient\u2019s most recent disease activity assessment", nmiChannel: "question_set", nmiRequestedAt: "Jun 24, 2026 9:15 AM" },
  { patient: "Owen Delgado", memberId: "MEM19850044", caseId: "CASE-00044", payerName: "Humana", programme: "Bonofide", stage: "Coordination", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jul 5, 2026", overdue: false, enrollmentDate: "Jun 29, 2026 11:02 AM", paStatus: "Payer Needs More Information", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "Embedded UI", drugName: "HUMIRA 40 MG/0.4ML PEN", routeOfAdministration: "Subcutaneous", prescriberName: "Priya Anand", servicingProviderName: "Dr. Renee Castillo", pharmacyName: "CarePoint Specialty Pharmacy", prescriberEmail: "priya.anand@example.com", prescriberPhone: "(555) 902-1187", urgency: "Not Urgent", dateCreated: "06/29/2026 11:02:00", reviewSubmittedDate: "06/29/2026 11:40:00", estimatedEndDate: "—", createdBy: "Aravind Reddy", authStartDate: "—", authEndDate: "—", authorizationId: "AUTH-8827460", moreInfoRequested: "clarification on the patient\u2019s current step-therapy status directly from the prescriber", nmiChannel: "email", nmiRequestedAt: "Jun 30, 2026 8:20 AM" },
  { patient: "Fatima Hassan", memberId: "MEM19850045", caseId: "CASE-00045", payerName: "Kaiser Permanente", programme: "Bonofide", stage: "Coordination", status: "Open", caseUrgency: "Urgent", slaDue: "Jul 2, 2026", overdue: false, enrollmentDate: "Jun 30, 2026 2:14 PM", paStatus: "Payer Needs More Information", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "API", drugName: "STELARA 90 MG/ML INJECTION", routeOfAdministration: "Subcutaneous", prescriberName: "David Chen", pharmacyName: "Woodville Home Infusion", prescriberEmail: "david.chen@example.com", prescriberPhone: "(555) 481-2039", urgency: "Urgent", dateCreated: "06/30/2026 14:14:00", reviewSubmittedDate: "06/30/2026 14:50:00", estimatedEndDate: "—", createdBy: "Aravind Reddy", authStartDate: "—", authEndDate: "—", authorizationId: "AUTH-8827461", moreInfoRequested: "verbal confirmation of the patient\u2019s current dosing regimen", nmiChannel: "call", nmiRequestedAt: "Jul 1, 2026 10:05 AM" },
  { patient: "Marcus Webb", memberId: "MEM19850046", caseId: "CASE-00046", payerName: "BCBS NJ", programme: "Bonofide", stage: "Coordination", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jul 8, 2026", overdue: false, enrollmentDate: "Jul 1, 2026 9:40 AM", paStatus: "Payer Needs More Information", eligibilityStatus: "success", paRequired: true, questionsSubmitted: true, intakeChannel: "Embedded UI", drugName: "ENBREL 50 MG/ML PEN", routeOfAdministration: "Subcutaneous", prescriberName: "Anita Krishnan", pharmacyName: "Lakeside Specialty Rx", prescriberEmail: "anita.krishnan@example.com", prescriberPhone: "(555) 328-7710", prescriberFax: "(555) 328-7711", urgency: "Not Urgent", dateCreated: "07/01/2026 09:40:00", reviewSubmittedDate: "07/01/2026 10:05:00", estimatedEndDate: "—", createdBy: "Aravind Reddy", authStartDate: "—", authEndDate: "—", authorizationId: "AUTH-8827462", moreInfoRequested: "recent lab values supporting continued therapy", nmiChannel: "fax", nmiRequestedAt: "Jul 2, 2026 1:30 PM" },
  { patient: "Emma Mark", memberId: "MEM19850029", caseId: "CASE-00029", prescriberName: "Dr. Owen Pratt", pharmacyName: "CarePoint Specialty Pharmacy", payerName: "Health Partners", programme: "Sun Tech", stage: "Benefits Investigation", status: "Open", caseUrgency: "Urgent", slaDue: "Jun 25, 2026", overdue: true, enrollmentDate: "Jun 23, 2026 4:07 PM", eligibilityStatus: "failed", eligibilityFailureReason: "Member eligibility not found.", paRequired: false, intakeChannel: "Embedded UI" },
  { patient: "Renee Castillo", memberId: "MEM19850042", caseId: "CASE-00042", prescriberName: "Dr. Grace Odom", pharmacyName: "Woodville Home Infusion", payerName: "Geisinger Health Plan", programme: "Sun Tech", stage: "Benefits Investigation", status: "Open", caseUrgency: "Not Urgent", slaDue: "Jul 3, 2026", overdue: false, enrollmentDate: "Jun 29, 2026 10:15 AM", eligibilityStatus: "success", paRequired: false, questionsSubmitted: false, intakeChannel: "Embedded UI" },
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
  { name: "Emma Mark", mrn: "MRN-00027", memberId: "MEM19850029", payerName: "Health Partners", email: "john.anderson_55@yopmail.com", phone: "7777788888", dob: "June 22, 2026", dobIso: "2026-06-22", gender: "Female", status: "Active", caseId: "CASE-00029", enrolmentId: "ENR-0048", streetAddress: "300 Biscayne Blvd", suite: "", city: "Miami", state: "FL", zip: "33131" },
  { name: "Carlos Mendez", mrn: "MRN-00031", memberId: "MEM19850033", payerName: "Geisinger Health Plan", email: "carlos.mendez@yopmail.com", phone: "5551029384", dob: "March 3, 1991", dobIso: "1991-03-03", gender: "Male", status: "Active", caseId: "CASE-00033", enrolmentId: "ENR-809DDB8C", streetAddress: "221B Baker Street", suite: "", city: "Springfield", state: "IL", zip: "62704" },
  { name: "Jackson Smith", mrn: "MRN-00008", memberId: "MEM19850031", payerName: "BCBS NJ", email: "naoh.field4@yopmail.com", phone: "1111111111", dob: "September 7, 2000", dobIso: "2000-09-07", gender: "Male", status: "Active", caseId: "CASE-00031", enrolmentId: "ENR-0052", streetAddress: "10204 Woodville Pond Dr", suite: "", city: "Springfield", state: "IL", zip: "62704" },
  { name: "Santosh Test Nair", mrn: "MRN-00026", memberId: "MEM19850034", payerName: "Kaiser Permanente", email: "naoh.field3@yopmail.com", phone: "5557741230", dob: "November 14, 1988", dobIso: "1988-11-14", gender: "Male", status: "Active", caseId: "CASE-00034", enrolmentId: "ENR-646F33E6", streetAddress: "18 Commerce Way", suite: "", city: "Springfield", state: "IL", zip: "62702" },
  { name: "Krish Watson", mrn: "MRN-00028", memberId: "MEM19850030", payerName: "Cigna Pharmacy Services", email: "krish@gmail.com", phone: "8778988776", dob: "June 18, 2026", dobIso: "2026-06-18", gender: "Male", status: "Active", caseId: "CASE-00030", enrolmentId: "ENR-A5C38E9C", streetAddress: "5500 Park Row Dr", suite: "Suite 4B", city: "Houston", state: "TX", zip: "77081" },
  { name: "Mickey Mouse", mrn: "MRN-00037", memberId: "MEM19850040", payerName: "BCBS NJ", email: "mickey.mouse@allfreemail.net", phone: "1234567890", dob: "June 26, 2000", dobIso: "2000-06-26", gender: "Male", status: "Active", caseId: "CASE-00040", enrolmentId: "ENR-0061", streetAddress: "1200 Sunset Blvd", suite: "", city: "Los Angeles", state: "CA", zip: "90026" },
  { name: "Mini Mouse", mrn: "MRN-00039", memberId: "MEM19850041", payerName: "Anthem Inc", email: "mini.mouse@allfreemail.net", phone: "6673516560", dob: "June 22, 2026", dobIso: "2026-06-22", gender: "Female", status: "Active", caseId: "CASE-00041", enrolmentId: "ENR-0062", streetAddress: "88 Franklin St", suite: "", city: "New York", state: "NY", zip: "10013" },
  { name: "Madmax G Madmax", mrn: "MRN-00019", memberId: "MEM19850038", payerName: "Cigna Pharmacy Services", email: "naoh.field1@yopmail.com", phone: "5553311220", dob: "June 12, 2026", dobIso: "2026-06-12", gender: "Male", status: "Active", caseId: "CASE-00038", enrolmentId: "ENR-0059", streetAddress: "400 Meridian Ave", suite: "Suite 220", city: "Springfield", state: "IL", zip: "62701" },
  { name: "Disney World", mrn: "MRN-00020", memberId: "MEM19850035", payerName: "Humana", email: "naoh.field2@yopmail.com", phone: "5558827744", dob: "January 20, 2003", dobIso: "2003-01-20", gender: "Male", status: "Active", caseId: "CASE-00035", enrolmentId: "ENR-0053", streetAddress: "18 Commerce Way", suite: "", city: "Springfield", state: "IL", zip: "62702" },
  { name: "Jack Mark", mrn: "MRN-00014", memberId: "MEM19850032", payerName: "Anthem Inc", email: "rendell.jamar@allwebemails.com", phone: "5556692210", dob: "January 20, 2003", dobIso: "2003-01-20", gender: "Male", status: "Active", caseId: "CASE-00032", enrolmentId: "ENR-0050", streetAddress: "300 Biscayne Blvd", suite: "", city: "Miami", state: "FL", zip: "33131" },
];

// The 4-stage Prior Authorization pipeline used on the Case Detail screen, for every case.
const CORE_STAGE_LABELS = ["Data & Intake", "Coverage Determination", "Benefit Investigation", "Prior Authorization"];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
  "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

// Matches a payer on its name OR any of its aliases (e.g. "blue" matches every BCBS
// variant via their "Blue Cross Blue Shield" / "blue" aliases) — a little smarter than
// plain substring-on-name search, without needing a real fuzzy-matching engine.
function matchesPayerQuery(payer, query) {
  const q = query.toLowerCase();
  if (payer.name.toLowerCase().includes(q)) return true;
  return (payer.aliases || []).some((a) => a.includes(q));
}

// Dosage and Unit are prepopulated straight from the drug's own description string
// (e.g. "Tylenol 325 MG Tablet" -> 325 / MG) the moment a drug is selected — no need to
// wait for Directions, since the strength is already right there in the name FDB gave it.
function parseDosageFromLabel(label) {
  const match = label.match(/([\d.]+)\s*(MG|MCG|ML|UNIT|G)\b/i);
  if (!match) return { dosage: "", unit: "" };
  return { dosage: match[1], unit: match[2].toUpperCase() };
}

// How the prescriber is addressed in every outbound message — email, text, fax, and the
// determination letter's salutation — "Dr. {Last Name}" reads as professional and matches
// standard clinical correspondence, rather than a bare first+last name. Used only for
// greetings/addressing; places that just need to unambiguously identify the person (a
// "cc:" line, a status update about them, their own self-declaration) keep the full name.
function prescriberSalutation(prescriberName) {
  if (!prescriberName) return "the prescriber";
  const parts = prescriberName.trim().split(/\s+/);
  const last = parts[parts.length - 1];
  return `Dr. ${last}`;
}

// Payer list per Agadia's PAHub payer directory. "type" determines whether Buy and Bill
// (and therefore the Medical PA path — Drug Administered Location, etc.) is offered at all
// for this enrollment: Pharmacy Only payers never see it; Medical + Pharmacy payers do.
// "aliases" makes search a little smarter than plain substring match — e.g. searching "Blue"
// surfaces every Blue Cross Blue Shield variant, not just payers with "Blue" literally in
// their name.
const PAYER_LIST = [
  { name: "Advocate Health Midwest", type: "Pharmacy Only" },
  { name: "AlohaCare", type: "Pharmacy Only" },
  { name: "Anthem Inc", type: "Medical + Pharmacy" },
  { name: "BCBS NJ", type: "Pharmacy Only", aliases: ["blue cross blue shield", "blue"] },
  { name: "BCBS of AZ", type: "Pharmacy Only", aliases: ["blue cross blue shield", "blue"] },
  { name: "BCBS of MI", type: "Medical + Pharmacy", aliases: ["blue cross blue shield", "blue"] },
  { name: "BCBS SC", type: "Pharmacy Only", aliases: ["blue cross blue shield", "blue"] },
  { name: "BCBSM Medicare", type: "Medical + Pharmacy", aliases: ["blue cross blue shield", "blue"] },
  { name: "Blue KC", type: "Pharmacy Only" },
  { name: "CareOregon", type: "Pharmacy Only" },
  { name: "Cigna Pharmacy Services", type: "Medical + Pharmacy" },
  { name: "Cooperative Benefits Group", type: "Pharmacy Only" },
  { name: "Excellus", type: "Medical Only" },
  { name: "Gainwell", type: "Medical + Pharmacy" },
  { name: "Geisinger Health Plan", type: "Medical + Pharmacy" },
  { name: "Health Partners", type: "Pharmacy Only" },
  { name: "Helping Hand Health", type: "Medical + Pharmacy" },
  { name: "Hometown", type: "Pharmacy Only" },
  { name: "Humana", type: "Medical + Pharmacy" },
  {
    name: "Kaiser Permanente",
    type: "Pharmacy Only",
    // Demo-only flag: this payer requires the prescriber to submit the PA questionnaire
    // directly (by law, per the new intel) — drives the disabled Submit Answers button
    // and its tooltip on the Clinical Questions tab.
    requiresPrescriberSubmission: true,
  },
  { name: "LucyRx", type: "Pharmacy Only" },
  { name: "Maxor National Pharamcy (Maxor)", type: "Pharmacy Only" },
  { name: "MC-21", type: "Pharmacy Only" },
  { name: "MedImpact", type: "Pharmacy Only" },
  { name: "MedOne", type: "Pharmacy Only" },
  { name: "Oscar", type: "Pharmacy Only" },
  { name: "Pharmacy Benefit Dimensions", type: "Medical + Pharmacy" },
  { name: "Point32Health", type: "Medical + Pharmacy" },
  { name: "ProActRx", type: "Pharmacy Only" },
  { name: "Providence Health Plan", type: "Medical + Pharmacy" },
  { name: "RxBenefits", type: "Pharmacy Only" },
  { name: "RxResults", type: "Medical + Pharmacy" },
  { name: "Samaritan Health Plans", type: "Pharmacy Only" },
  { name: "Sanford Security Health", type: "Medical + Pharmacy" },
  { name: "SelectHealth", type: "Medical + Pharmacy" },
  { name: "Sentara Health Plans", type: "Medical + Pharmacy" },
  { name: "Serve You Custom Rx Mgmnt", type: "Pharmacy Only" },
  { name: "SlateRx", type: "Pharmacy Only" },
  { name: "Southern Scripts", type: "Medical + Pharmacy" },
  { name: "State of Utah", type: "Medical + Pharmacy" },
  { name: "TrueScripts", type: "Pharmacy Only" },
  { name: "Unite Here Health", type: "Pharmacy Only" },
  { name: "UPMC Health Plan", type: "Medical + Pharmacy" },
  { name: "US-Rx Care", type: "Pharmacy Only" },
  { name: "WellDyneRx", type: "Pharmacy Only" },
  { name: "Western Health Advantage", type: "Pharmacy Only" },
];

// Drug directory for the Drug Details autocomplete — 10 illustrative entries, three of them
// Tylenol variants so typing "tyl" demonstrates multiple strength/form matches at once.
// NDC and J-Code formats are illustrative for this wireframe, not verified real-world codes.
// "route" is FDB's answer for this specific drug — narrowed to the 4 routes Valarie flagged
// as most common (Infusion, Injectable, Oral, Topical) — as an array, since FDB sometimes
// returns more than one valid route for the same drug. If there's only one, it's locked
// (Ajit: "if this drug is only administered subcutaneously, why should we have to ask?");
// if there's more than one, Route becomes a real dropdown of just those options.
const DRUG_DATABASE = [
  { label: "Tylenol 325 MG Tablet", ndc: "50580-0614-01", jCode: "J8499", route: ["Oral"] },
  { label: "Tylenol 500 MG Caplet", ndc: "50580-0490-01", jCode: "J8499", route: ["Oral"] },
  { label: "Tylenol 325 MG Gelcap", ndc: "50580-0614-02", jCode: "J8499", route: ["Oral"] },
  { label: "Advil 200 MG Tablet", ndc: "30573-0138-02", jCode: "J8499", route: ["Oral"] },
  { label: "Botox 100 UNIT Injection", ndc: "00023-1145-01", jCode: "J0585", route: ["Injectable"] },
  { label: "Humira 40 MG/0.4ML Pen", ndc: "00074-4339-02", jCode: "J0135", route: ["Injectable"] },
  { label: "Ozempic 0.25 MG/DOSE Pen", ndc: "00169-4130-12", jCode: "J3490", route: ["Injectable"] },
  { label: "Enbrel 50 MG/ML Pen", ndc: "58406-0435-01", jCode: "J1438", route: ["Injectable"] },
  { label: "Xolair 150 MG Injection", ndc: "50242-0040-62", jCode: "J2357", route: ["Infusion"] },
  { label: "Trulicity 1.5 MG/0.5ML Pen", ndc: "00002-1433-80", jCode: "J3490", route: ["Injectable"] },
  { label: "Remicade 100 MG Injection", ndc: "57894-0030-01", jCode: "J1745", route: ["Infusion", "Injectable"] },
  { label: "Rinvoq 15 MG Tablet", ndc: "00074-0177-13", jCode: "J8499", route: ["Oral"] },
  { label: "Cosentyx 150 MG/ML Pen", ndc: "00078-0639-61", jCode: "J3590", route: ["Injectable"] },
  { label: "Stelara 90 MG/ML Injection", ndc: "57894-0060-03", jCode: "J3357", route: ["Infusion", "Injectable"] },
  { label: "Dupixent 300 MG/2ML Pen", ndc: "61755-0008-02", jCode: "J3490", route: ["Injectable"] },
  { label: "Solu-Medrol 125 MG Injection", ndc: "00009-0698-01", jCode: "J2930", route: ["Injectable", "Infusion"] },
  { label: "Xeljanz 5 MG Tablet", ndc: "00069-0151-30", jCode: "J8499", route: ["Oral"] },
  { label: "Otezla 30 MG Tablet", ndc: "59572-0620-42", jCode: "J8499", route: ["Oral"] },
  { label: "Skyrizi 150 MG/ML Pen", ndc: "00074-0140-02", jCode: "J3590", route: ["Injectable"] },
  { label: "Simponi Aria 50 MG/4ML Injection", ndc: "57894-0501-03", jCode: "J1602", route: ["Infusion", "Injectable"] },
];

// Small canned USPS-style address directory, standing in for the real USPS address-validation
// API Ajit asked to integrate. Typing part of an address surfaces matches; "label" is only
// what's shown in the search dropdown for disambiguation — selecting a match fills Street
// Address with "street" alone (not the full label), and City/State/ZIP separately.
const ADDRESS_DATABASE = [
  { label: "10204 Woodville Pond Dr, Springfield, IL 62704", street: "10204 Woodville Pond Dr", city: "Springfield", state: "IL", zip: "62704" },
  { label: "221B Baker Street, Springfield, IL 62704", street: "221B Baker Street", city: "Springfield", state: "IL", zip: "62704" },
  { label: "400 Meridian Ave, Springfield, IL 62701", street: "400 Meridian Ave", city: "Springfield", state: "IL", zip: "62701" },
  { label: "18 Commerce Way, Springfield, IL 62702", street: "18 Commerce Way", city: "Springfield", state: "IL", zip: "62702" },
  { label: "5500 Park Row Dr, Houston, TX 77081", street: "5500 Park Row Dr", city: "Houston", state: "TX", zip: "77081" },
  { label: "1200 Sunset Blvd, Los Angeles, CA 90026", street: "1200 Sunset Blvd", city: "Los Angeles", state: "CA", zip: "90026" },
  { label: "88 Franklin St, New York, NY 10013", street: "88 Franklin St", city: "New York", state: "NY", zip: "10013" },
  { label: "300 Biscayne Blvd, Miami, FL 33131", street: "300 Biscayne Blvd", city: "Miami", state: "FL", zip: "33131" },
];

// Structured allergy codes, standing in for a First Data Bank / RxNorm ingredient-based
// allergy list (Ajit: "let's not free text this... First Data Bank proprietary code").
// Searchable by name; storing the code + label pair rather than free text.
const ALLERGY_CODES = [
  { code: "7980", label: "Penicillins" },
  { code: "7981", label: "Sulfonamides (Sulfa drugs)" },
  { code: "1191", label: "Aspirin / NSAIDs" },
  { code: "7982", label: "Cephalosporins" },
  { code: "7983", label: "Latex" },
  { code: "7984", label: "Iodine / Contrast Media" },
  { code: "7985", label: "Shellfish" },
  { code: "7986", label: "Peanuts / Tree Nuts" },
  { code: "7987", label: "Eggs" },
  { code: "7988", label: "Codeine / Opioids" },
];

// Structured ICD-10 diagnosis codes — searchable dropdown, not free text, matching the
// same codified pattern used for Allergies (diagnosis already had codes; Ajit used it as
// the example everything else should follow).
const ICD10_CODES = [
  { code: "G35", label: "Multiple sclerosis" },
  { code: "L40.0", label: "Psoriasis vulgaris" },
  { code: "M05.79", label: "Rheumatoid arthritis with rheumatoid factor, multiple sites" },
  { code: "K50.90", label: "Crohn's disease, unspecified, without complications" },
  { code: "J45.909", label: "Unspecified asthma, uncomplicated" },
  { code: "E11.9", label: "Type 2 diabetes mellitus without complications" },
  { code: "M06.9", label: "Rheumatoid arthritis, unspecified" },
  { code: "L20.9", label: "Atopic dermatitis, unspecified" },
  { code: "G43.909", label: "Migraine, unspecified, not intractable" },
  { code: "M35.9", label: "Systemic involvement of connective tissue, unspecified" },
];

// Mock NPI registry lookup — standing in for the real NPI Registry API. Entering one of
// these numbers and clicking Lookup prepopulates First Name, Last Name, and full address,
// matching what the existing Neutrinos build already does per Atharav's own testing.
const NPI_DATABASE = {
  "1234567890": { firstName: "Scot", lastName: "Lovejoy", licenseState: "IL", licenseNumber: "88213", streetAddress: "400 Meridian Ave", suite: "Suite 220", city: "Springfield", state: "IL", zip: "62701" },
  "1922334455": { firstName: "Renee", lastName: "Castillo", licenseState: "IL", licenseNumber: "77410", streetAddress: "18 Commerce Way", suite: "", city: "Springfield", state: "IL", zip: "62702" },
  "1015049598": { firstName: "Amit", lastName: "Kapoor", licenseState: "TX", licenseNumber: "55902", streetAddress: "5500 Park Row Dr", suite: "Suite 4B", city: "Houston", state: "TX", zip: "77081" },
};

// Same NPI-lookup pattern, applied to Pharmacy — an NPI here resolves to a business
// (Business Name, NCPDP ID, address), not a person's name.
const PHARMACY_NPI_DATABASE = {
  "1922334455": { businessName: "Sun Tech Specialty Pharmacy", ncpdpId: "3299481", streetAddress: "18 Commerce Way", suite: "", city: "Springfield", state: "IL", zip: "62702" },
  "1699887766": { businessName: "Meridian Infusion Pharmacy", ncpdpId: "4471002", streetAddress: "88 Franklin St", suite: "Suite 5", city: "New York", state: "NY", zip: "10013" },
  "1477665544": { businessName: "Westside Specialty Rx", ncpdpId: "5528113", streetAddress: "1200 Sunset Blvd", suite: "", city: "Los Angeles", state: "CA", zip: "90026" },
};

const DRUG_ADMINISTERED_LOCATIONS = [
  "Physician's Office",
  "Outpatient Hospital",
  "Ambulatory Surgical Center",
  "Infusion Center",
  "Home",
  "Inpatient",
  "Dialysis Center",
  "Emergency Room",
  "Urgent Care Center",
  "Veteran's Affairs Facility",

  "Retail Pharmacy",
  "Other",
];

// Real payer PA questionnaires are overwhelmingly Yes/No or multiple-choice — a data point
// like weight is a number field, not free text — and only a genuinely open-ended "anything
// else" question is actually free text. Matching that mix here instead of five identical
// text boxes.
const PA_QUESTIONS = [
  { id: 1, text: "Has the patient tried and failed a preferred alternative therapy?", type: "yesno" },
  { id: 2, text: "What is the patient's current weight (kg) for dosing calculation?", type: "number" },
  { id: 3, text: "What is the severity of the patient's spasticity in the target area?", type: "multiplechoice", options: ["Mild", "Moderate", "Severe", "Not documented"] },
  { id: 4, text: "Has the prescriber attached supporting clinical notes for this request?", type: "yesno" },
  { id: 5, text: "Any additional comments for the payer's review team?", type: "text", optional: true },
];

// A second, distinct question set — not the same array as PA_QUESTIONS, and not a
// continuation of it. This is what shows up when the Payer moves a case to "Payer Needs
// More Information" and chooses to send new questions back through AnvayaRx rather than
// reaching out to the prescriber by email or phone/fax directly (see PayerOutreachLogPanel
// for those other two paths). Reuses the exact same Clinical-Questions UI/mechanics as the
// first round — same component, different question array and a different Task title so
// the two rounds are never confused with each other.
const PA_QUESTIONS_ADDITIONAL = [
  { id: 1, text: "Please provide the date of the patient's most recent disease activity assessment.", type: "text" },
  { id: 2, text: "Has the patient experienced any adverse reactions to prior therapies?", type: "yesno" },
  { id: 3, text: "Please attach or describe any additional chart notes supporting continued need for this therapy.", type: "text", optional: true },
];

// Fixed demo answers for cases whose PA has already been decided — shown
// read-only, so a resolved case doesn't present the same blank question flow
// as an unanswered one.
const PA_QUESTION_ANSWERS = ["Yes", "72", "Severe", "Yes", "No additional comments."];

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
  "Awaiting Prescriber Input": { pill: "border-violet-200 bg-violet-50 text-violet-600", icon: Clock },
  "Under Payer Review": { pill: "border-amber-200 bg-amber-50 text-amber-600", icon: Clock },
  Approved: { pill: "border-green-200 bg-green-50 text-green-600", icon: CheckCircle2 },
  Denied: { pill: "border-red-200 bg-red-50 text-red-600", icon: XCircle },
  "Partially Approved": { pill: "border-orange-200 bg-orange-50 text-orange-600", icon: AlertTriangle },
  "Payer Needs More Information": { pill: "border-purple-200 bg-purple-50 text-purple-600", icon: AlertTriangle },
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
  { title: "Answer PA Questions", type: "pa_questions", caseId: "CASE-00041", patient: "Mini Mouse", programme: "Botox drug program", caseUrgency: "Not Urgent", status: "Pending", dueDate: "Jul 2, 2026", createdAt: "Jun 28, 2026" },
  { title: "PA Status", type: "pa_status", caseId: "CASE-00038", patient: "Madmax G Madmax", programme: "Bonofide", caseUrgency: "Not Urgent", status: "Pending", dueDate: "Jul 3, 2026", createdAt: "Jun 27, 2026" },
  { title: "PA Status", type: "pa_status", caseId: "CASE-00031", patient: "Jackson Smith", programme: "Bonofide", caseUrgency: "Urgent", status: "Pending", dueDate: "Jun 30, 2026", createdAt: "Jun 23, 2026" },
  { title: "Answer Additional PA Questions", type: "pa_questions_additional", caseId: "CASE-00030", patient: "Krish Watson", programme: "Bonofide", caseUrgency: "Urgent", status: "Pending", dueDate: "Jun 30, 2026", createdAt: "Jun 24, 2026" },
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
  { patient: "Wanda Ferris", enrollmentId: "ENR-0054", caseId: "Not yet created", status: "Draft", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 12:22 PM" },
  { patient: "Santosh Test Nair Test", enrollmentId: "ENR-646F33E6", caseId: "CASE-00034", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 9:56 AM" },
  { patient: "Disney World", enrollmentId: "ENR-0053", caseId: "CASE-00035", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 9:04 AM" },
  { patient: "Carlos Mendez", enrollmentId: "ENR-809DDB8C", caseId: "CASE-00033", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 3:55 AM" },
  { patient: "Jack Mark", enrollmentId: "ENR-0050", caseId: "CASE-00032", status: "Accepted", caseUrgency: "Not Urgent", createdAt: "Jun 24, 2026 3:54 AM" },
  { patient: "Jackson Smith", enrollmentId: "ENR-0052", caseId: "CASE-00031", status: "Accepted", caseUrgency: "Urgent", createdAt: "Jun 23, 2026 4:44 PM" },
  { patient: "Helen Garth", enrollmentId: "ENR-0051", caseId: "Not yet created", status: "Draft", caseUrgency: "Not Urgent", createdAt: "Jun 23, 2026 4:42 PM" },
];

const ENROLLMENT_TABS = ["Payer & Patient Information", "Prescriber & Servicing Provider", "Drug Details", "Pharmacy", "Summary"];

// ---------------------------------------------------------------------------
// Mock enrollment data builders
// ---------------------------------------------------------------------------

function emptyEnrollmentData() {
  return {
    payer: { name: "", urgency: "" },
    patient: { firstName: "", lastName: "", dob: "", gender: "", memberId: "", streetAddress: "", suite: "", city: "", state: "", zip: "" },
    prescriber: { firstName: "", lastName: "", npi: "", licenseState: "", licenseNumber: "", taxId: "", phoneType: "Mobile", phone: "", faxType: "Office", fax: "", email: "", confirmEmail: "", streetAddress: "", suite: "", city: "", state: "", zip: "" },
    servicingProvider: { sameAsPrescriber: true, firstName: "", lastName: "", npi: "", licenseState: "", licenseNumber: "", taxId: "", phoneType: "Mobile", phone: "", faxType: "Office", fax: "", streetAddress: "", suite: "", city: "", state: "", zip: "" },
    pharmacy: { npi: "", ncpdpId: "", businessName: "", streetAddress: "", suite: "", city: "", state: "", zip: "", phoneType: "Mobile", phone: "", faxType: "Office", fax: "" },
    prescription: {
      drugDescription: "", ndc: "", jCode: "", route: "",
      directions: "", dosage: "", unit: "",
      quantity: "", daysSupply: "", startDateOfService: "",
      buyAndBill: "", administeredLocation: "", administeredLocationOther: "",
      allergyCode: "", allergyQuery: "",
      icd10Code: "", icd10Query: "", otherIcd10Code: "", otherIcd10Query: "",
    },
    submission: {},
  };
}

function mockEnrollmentDataFromCase(caseItem) {
  const parts = (caseItem?.patient || "Unknown Patient").split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "—";
  return {
    payer: {
      name: "Anthem Inc",
      urgency: caseItem?.caseUrgency || "Not Urgent",
    },
    patient: {
      firstName,
      lastName,
      dob: "04/12/1985",
      gender: "Female",
      memberId: caseItem?.memberId || "MEM19850000",
      streetAddress: "221B Baker Street",
      suite: "",
      city: "Springfield",
      state: "IL",
      zip: "62704",
    },
    prescriber: {
      firstName: "Scot",
      lastName: "Lovejoy",
      npi: "1234567890",
      licenseState: "IL",
      licenseNumber: "88213",
      taxId: "XX-XXXXXXX",
      phoneType: "Mobile",
      phone: "(555) 431-9020",
      faxType: "Office",
      fax: "(555) 431-9021",
      email: "scot.lovejoy@springfieldclinic.example",
      confirmEmail: "scot.lovejoy@springfieldclinic.example",
      streetAddress: "400 Meridian Ave",
      suite: "Suite 220",
      city: "Springfield",
      state: "IL",
      zip: "62701",
    },
    servicingProvider: {
      sameAsPrescriber: true,
      firstName: "",
      lastName: "",
      npi: "",
      licenseState: "",
      licenseNumber: "",
      taxId: "",
      phoneType: "Mobile",
      phone: "",
      faxType: "Office",
      fax: "",
      streetAddress: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
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
      phoneType: "Mobile",
      phone: "(555) 887-2200",
      faxType: "Office",
      fax: "(555) 887-2201",
    },
    prescription: {
      drugDescription: "Botox 100 UNIT Injection",
      ndc: "00023-1145-01",
      jCode: "J0585",
      route: "Injectable",
      directions: "Inject 100 units intramuscularly once every 12 weeks",
      dosage: "100",
      unit: "UNIT",
      quantity: "1",
      daysSupply: "90",
      startDateOfService: "07/01/2026",
      administeredLocation: "Physician's Office",
      administeredLocationOther: "",
      buyAndBill: "Yes",
      allergyCode: "",
      allergyQuery: "NKDA",
      icd10Code: "G35",
      icd10Query: "G35 — Multiple sclerosis",
      otherIcd10Code: "",
      otherIcd10Query: "",
    },
    submission: {},
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
// detail view so the two never disagree, and every case isn't "Coverage Determination Failed."
// One consistent pill shape everywhere (same padding, height, corner radius, font
// weight) — only the color and label change — plus a hover tooltip explaining what
// the status actually means, since the label alone doesn't always make that obvious.
const CASE_STATUS_TONE_STYLES = {
  red: { dot: "bg-red-500", className: "bg-red-50 text-red-700", border: "border-red-500", heading: "text-red-700" },
  green: { dot: "bg-emerald-500", className: "bg-emerald-50 text-emerald-700", border: "border-emerald-500", heading: "text-emerald-700" },
  orange: { dot: "bg-orange-500", className: "bg-orange-50 text-orange-700", border: "border-orange-500", heading: "text-orange-700" },
  amber: { dot: "bg-amber-500", className: "bg-amber-50 text-amber-700", border: "border-amber-500", heading: "text-amber-700" },
  blue: { dot: "bg-sky-500", className: "bg-sky-50 text-sky-700", border: "border-sky-500", heading: "text-sky-700" },
  slate: { dot: "bg-slate-400", className: "bg-slate-100 text-slate-600", border: "border-slate-400", heading: "text-slate-600" },
  purple: { dot: "bg-violet-500", className: "bg-violet-50 text-violet-700", border: "border-violet-500", heading: "text-violet-700" },
};

// The hover-tooltip copy for each status — what actually happened / what's being
// waited on, so the label alone doesn't have to carry all of that.
const CASE_STATUS_DESCRIPTIONS = {
  "Awaiting Questionnaire": "Case has been created — awaiting clinical questions from the Payer.",
  "Awaiting Response": "Payer has posted the clinical questions — awaiting your response.",
  "Awaiting Prescriber Input": "Sent to the prescriber for review and submission — awaiting their response via the secure link emailed and texted to them.",
  "Under Payer Review": "Your answers to the clinical questions have been submitted — the Payer has not yet responded with a decision.",
  "Coverage Determination Failed": "Member ID was invalid, member not found, or multiple eligibility records were found for this member.",
  "Approved": "Prior Authorization request has been approved.",
  "Denied": "Prior Authorization request has been denied by the payer.",
  "Partially Approved": "Your Prior Authorization request has been partially approved by the payer.",
  "Payer Needs More Information": "Payer needs more information regarding this request.",
  "PA Not Required": "Coverage Determination passed and Benefit Investigation determined this drug does not require Prior Authorization for this plan.",
};

// Standardized case-status taxonomy, applied identically in Case Status's Status
// column and everywhere else a case status is shown, for both the Partner and
// AnvayaRx Admin views:
//   1. Coverage Determination Failed -- eligibilityStatus="failed"; specific reason shown on click-through only
//   2. Awaiting Questionnaire      -- eligibilityStatus="pending": Agadia-level Coverage Determination/BI validation still running
//   3. Awaiting Response           -- Coverage Determination/BI passed, questionnaire arrived, Partner has not yet submitted answers
//   4. Awaiting Prescriber Input   -- Partner used Contact Prescriber; the prescriber (or their staff) has not yet
//      submitted from their own secure-link view — see PrescriberSecureLinkFlow
//   5. Under Payer Review     -- answers submitted (by the Partner OR by the prescriber), awaiting the PA decision
//   6. Approved / Partially Approved / Denied -- the actual decisioned outcome, shown explicitly rather than
//      collapsed into one generic "Decisioned Cases" bucket that hid what the decision actually was
//   7. Payer Needs More Information -- its own distinct bucket, not grouped with the decisioned outcomes
function getCaseStatusInfo(caseItem) {
  if (caseItem.eligibilityStatus === "failed") {
    return { label: "Coverage Determination Failed", tone: "red" };
  }
  if (caseItem.eligibilityStatus === "pending") {
    return { label: "Awaiting Questionnaire", tone: "slate" };
  }
  if (caseItem.paStatus === "Payer Needs More Information") {
    return { label: "Payer Needs More Information", tone: "purple" };
  }
  if (caseItem.paStatus === "Approved") {
    return { label: "Approved", tone: "green" };
  }
  if (caseItem.paStatus === "Partially Approved") {
    return { label: "Partially Approved", tone: "orange" };
  }
  if (caseItem.paStatus === "Denied") {
    return { label: "Denied", tone: "red" };
  }
  if (caseItem.paRequired) {
    if (caseItem.questionsSubmitted) {
      return { label: "Under Payer Review", tone: "blue" };
    }
    if (caseItem.prescriberContacted) {
      return { label: "Awaiting Prescriber Input", tone: "purple" };
    }
    return { label: "Awaiting Response", tone: "amber" };
  }
  return { label: "PA Not Required", tone: "green" };
}

// Maps a case onto the 4-stage pipeline used on the Case Status action screen
// (Data & Intake, Coverage Determination, Benefit Investigation, Prior Authorization) so both
// the list and the action view always agree. PA Review and Appeals were dropped —
// not needed for now.
function getCoreStageIndex(caseItem) {
  if (caseItem.eligibilityStatus === "pending") return 1; // Coverage Determination/BI still running
  if (caseItem.eligibilityStatus === "failed") return 1; // stuck at Coverage Determination
  if (caseItem.paStatus || caseItem.paRequired) return 3; // in/through Prior Authorization
  return 2; // cleared eligibility, sitting in Benefit Investigation
}

function CaseStatusBadge({ caseItem, showReason = false }) {
  const [hovered, setHovered] = useState(false);
  const { label, tone } = getCaseStatusInfo(caseItem);
  const style = CASE_STATUS_TONE_STYLES[tone];
  // Coverage Determination Failed always carries a specific reason from Agadia — there is no
  // generic "reason not specified" state, so the hover card always has something real
  // to show for it, in addition to the general status description.
  const description =
    caseItem.eligibilityStatus === "failed" && caseItem.eligibilityFailureReason ? caseItem.eligibilityFailureReason : CASE_STATUS_DESCRIPTIONS[label] || "";
  const displayLabel = showReason && caseItem.eligibilityStatus === "failed" ? `${label} \u2014 ${caseItem.eligibilityFailureReason}` : label;
  return (
    <span className="relative inline-block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className={`inline-flex min-h-[26px] cursor-default items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
        {displayLabel}
      </span>
      {/* Expands from the pill itself on hover, rather than a plain system tooltip —
          same color family, just a bigger card with the full explanation inside.
          Driven by real mouse-enter/leave state rather than a CSS-only :hover trick,
          so it doesn't depend on a particular Tailwind build picking up group-hover. */}
      {description && hovered && (
        <span className={`absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border-l-4 bg-white px-3.5 py-3 text-left shadow-xl ${style.border}`}>
          <span className={`mb-1 block text-[11px] font-bold uppercase tracking-wide ${style.heading}`}>{label}</span>
          <span className="block text-xs font-medium leading-snug text-slate-600">{description}</span>
        </span>
      )}
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

// A proportional breakdown bar — more informative than a flat list of numbers, since the
// relative size of each segment is visible at a glance, not just its label.
function SegmentBar({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {segments.map((s) =>
          s.value > 0 ? <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }} className="h-full first:rounded-l-full last:rounded-r-full" /> : null
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label} <span className="font-semibold text-slate-700">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
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

// Format patterns used across the form's field-level validation.
const FORMAT_PATTERNS = {
  alpha: /^[A-Za-z\s'\-.]+$/,
  numeric: /^[0-9]+$/,
  alphanumeric: /^[A-Za-z0-9\s\-\/.]+$/,
  zip: /^[0-9]{5}(-[0-9]{4})?$/,
  npi: /^[0-9]{10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const FORMAT_HINTS = {
  alpha: "letters only",
  numeric: "numbers only",
  alphanumeric: "letters and numbers only",
  zip: "5-digit ZIP code",
  npi: "10-digit NPI",
  email: "a valid email address",
};

// Shared validator — given a list of {key, label, value, required, format} rules and the
// section's data object, returns { key: errorMessage } for anything missing or malformed.
// A rule can also carry {matchValue, matchLabel} (used for Confirm Email) — once the field
// itself is present and correctly formatted, it's additionally checked against that other
// field's current value and flagged if the two don't agree.
function validateFields(rules) {
  const errors = {};
  for (const rule of rules) {
    const value = (rule.value || "").toString().trim();
    if (rule.required && !value) {
      errors[rule.key] = `${rule.label} is missing`;
      continue;
    }
    if (value && rule.format && FORMAT_PATTERNS[rule.format] && !FORMAT_PATTERNS[rule.format].test(value)) {
      errors[rule.key] = `${rule.label} must contain ${FORMAT_HINTS[rule.format]}`;
      continue;
    }
    if (value && rule.matchValue !== undefined && value.toLowerCase() !== (rule.matchValue || "").toString().trim().toLowerCase()) {
      errors[rule.key] = `${rule.label} does not match ${rule.matchLabel}`;
    }
  }
  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
      <AlertTriangle size={11} /> {message}
    </p>
  );
}

function TextField({ label, required, value, onChange, placeholder, type = "text", error, format }) {
  // Two layers, not one: onKeyDown blocks a disallowed character before it's ever typed
  // (so numbers physically can't land in a name field), and onChange's filtering below
  // catches anything that arrives another way — paste, autofill, drag-and-drop.
  const ALLOWED_CHAR = {
    alpha: /^[A-Za-z\s'\-.]$/,
    numeric: /^[0-9]$/,
    alphanumeric: /^[A-Za-z0-9\s\-\/.]$/,
  };
  const STRIP_PATTERN = {
    alpha: /[^A-Za-z\s'\-.]/g,
    numeric: /[^0-9]/g,
    alphanumeric: /[^A-Za-z0-9\s\-\/.]/g,
  };
  const NAV_KEYS = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", "Escape"];

  const handleKeyDown = (e) => {
    if (!format || !ALLOWED_CHAR[format]) return;
    if (e.ctrlKey || e.metaKey || e.altKey || NAV_KEYS.includes(e.key) || e.key.length !== 1) return;
    if (!ALLOWED_CHAR[format].test(e.key)) e.preventDefault();
  };

  const handleChange = (raw) => {
    if (!format || type === "date" || !STRIP_PATTERN[format]) {
      onChange(raw);
      return;
    }
    onChange(raw.replace(STRIP_PATTERN[format], ""));
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder || label}
        className={`w-full rounded-md border px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none ${
          error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400"
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}

function SelectField({ label, required, value, onChange, options, placeholder, error }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none ${
          error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400"
        }`}
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
      <FieldError message={error} />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        rows={3}
        className={`w-full rounded-md border px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none ${
          error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400"
        }`}
      />
      <FieldError message={error} />
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

// Phone stays a type + number pair — Mobile/Home/Work is a meaningful distinction for a
// phone number. Fax does not get the same treatment (see FaxField below) — a fax line
// doesn't have a "Mobile" variant, so that dropdown never made sense there.
function PhoneField({ label, required, typeValue, phoneValue, onTypeChange, onPhoneChange, error }) {
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
          onKeyDown={(e) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
            if (!/^[0-9()\-\s]$/.test(e.key)) e.preventDefault();
          }}
          onChange={(e) => onPhoneChange(e.target.value.replace(/[^0-9()\-\s]/g, ""))}
          placeholder="Phone number"
          className={`flex-1 rounded-md border px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none ${
            error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400"
          }`}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

// Fax gets a location, not a device type — there is no "Mobile" fax. Office/Home covers
// the real distinction and avoids the confusing Mobile/Home/Work carried over from Phone.
function FaxField({ label, required, typeValue, faxValue, onTypeChange, onFaxChange, error }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </label>
      <div className="flex gap-2">
        <select value={typeValue} onChange={(e) => onTypeChange(e.target.value)} className="w-32 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none">
          <option>Office</option>
          <option>Home</option>
        </select>
        <input
          value={faxValue}
          onKeyDown={(e) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
            if (!/^[0-9()\-\s]$/.test(e.key)) e.preventDefault();
          }}
          onChange={(e) => onFaxChange(e.target.value.replace(/[^0-9()\-\s]/g, ""))}
          placeholder="Fax number"
          className={`flex-1 rounded-md border px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none ${
            error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400"
          }`}
        />
      </div>
      <FieldError message={error} />
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

// Generic type-to-search dropdown, used for Payer, Address lookup, Allergies, ICD-10, and
// each of the three bidirectional Drug Details fields. Matching is left to the caller
// (via getMatches) so each use case can filter its own dataset on its own key.
function SearchableSelectField({ label, required, value, onChange, getMatches, renderMatch, getMatchLabel, onSelect, placeholder, minChars = 1, subLabel, error, format }) {
  const [open, setOpen] = useState(false);
  const matches = value && value.trim().length >= minChars ? getMatches(value.trim()) : [];

  const ALLOWED_CHAR = { alpha: /^[A-Za-z\s'\-.]$/ };
  const STRIP_PATTERN = { alpha: /[^A-Za-z\s'\-.]/g };
  const handleKeyDown = (e) => {
    if (!format || !ALLOWED_CHAR[format]) return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    if (!ALLOWED_CHAR[format].test(e.key)) e.preventDefault();
  };
  const handleChange = (raw) => {
    onChange(format && STRIP_PATTERN[format] ? raw.replace(STRIP_PATTERN[format], "") : raw);
    setOpen(true);
  };

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </label>
      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className={`w-full rounded-md border py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none ${
            error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400"
          }`}
        />
      </div>
      {subLabel}
      {open && matches.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {matches.map((m) => (
            <button
              key={getMatchLabel(m)}
              type="button"
              onMouseDown={() => {
                setOpen(false);
                onSelect(m);
              }}
              className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-indigo-50"
            >
              {renderMatch(m)}
            </button>
          ))}
        </div>
      )}
      {open && value && value.trim().length >= minChars && matches.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-lg">No matches found.</div>
      )}
      <FieldError message={error} />
    </div>
  );
}

// Drug Details' three bidirectional fields (Drug Description, NDC, J-Code) all search the
// same DRUG_DATABASE, just on a different key — selecting any match from any of the three
// populates all three, per the requirement that knowing one should fill in the other two.
function DrugSearchField({ label, drugKey, value, onChange, onSelectDrug, placeholder, minChars, error }) {
  return (
    <SearchableSelectField
      label={label}
      required
      value={value}
      onChange={onChange}
      minChars={minChars}
      placeholder={placeholder}
      error={error}
      getMatches={(q) => DRUG_DATABASE.filter((d) => d[drugKey].toLowerCase().includes(q.toLowerCase()))}
      getMatchLabel={(d) => d.label + d.ndc}
      onSelect={onSelectDrug}
      renderMatch={(d) => (
        <>
          <span className="font-medium text-slate-700">{d.label}</span>
          <span className="text-xs text-slate-400">
            NDC {d.ndc} · HCPCS/CPT {d.jCode}
          </span>
        </>
      )}
    />
  );
}

// Stands in for the USPS address-validation API: typing part of an address surfaces
// matches from ADDRESS_DATABASE; selecting one prepopulates City, State, ZIP together.
function AddressSearchField({ value, onChange, onSelectAddress, error }) {
  return (
    <SearchableSelectField
      label="Street Address"
      required
      value={value}
      onChange={onChange}
      minChars={2}
      placeholder="Start typing an address — e.g. 10204 Woodville"
      error={error}
      getMatches={(q) => ADDRESS_DATABASE.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()))}
      getMatchLabel={(a) => a.label}
      onSelect={onSelectAddress}
      renderMatch={(a) => <span className="text-slate-700">{a.label}</span>}
    />
  );
}

// Structured allergy search (First Data Bank / RxNorm ingredient-based codes) — replaces
// free text with a searchable, codified selection.
function AllergySearchField({ value, onChange, onSelectAllergy }) {
  return (
    <SearchableSelectField
      label="Allergies"
      value={value}
      onChange={onChange}
      minChars={1}
      placeholder="Search an allergy — e.g. penicillin"
      getMatches={(q) => ALLERGY_CODES.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()))}
      getMatchLabel={(a) => a.code}
      onSelect={onSelectAllergy}
      renderMatch={(a) => (
        <>
          <span className="font-medium text-slate-700">{a.label}</span>
          <span className="text-xs text-slate-400">Code {a.code}</span>
        </>
      )}
    />
  );
}

// Structured ICD-10 search — same codified pattern as Allergies, now applied consistently
// instead of the earlier free-text field.
function Icd10SearchField({ label, value, onChange, onSelectCode, required, error }) {
  return (
    <SearchableSelectField
      label={label}
      required={required}
      value={value}
      onChange={onChange}
      minChars={1}
      placeholder="Search a diagnosis or ICD-10 code"
      error={error}
      getMatches={(q) => ICD10_CODES.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase()))}
      getMatchLabel={(c) => c.code}
      onSelect={onSelectCode}
      renderMatch={(c) => (
        <>
          <span className="font-medium text-slate-700">{c.code}</span>
          <span className="text-xs text-slate-400"> — {c.label}</span>
        </>
      )}
    />
  );
}

// NPI lookup — number entered, Lookup clicked, prepopulates name + address from NPI_DATABASE.
function NpiLookupField({ value, onChange, onLookup, error, hint }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        <span className="mr-1 text-red-500">*</span>NPI #
      </label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. 1234567890"
          className={`flex-1 rounded-md border px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none ${
            error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400"
          }`}
        />
        <button type="button" onClick={onLookup} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-slate-50">
          <Search size={13} /> Lookup
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
      <FieldError message={error} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Enrollment form tabs
// ---------------------------------------------------------------------------

function PayerAndPatientTab({ data, update, errors = {} }) {
  const payer = data.payer;
  const patient = data.patient;
  const selectedPayer = PAYER_LIST.find((p) => p.name === payer.name);
  const setPatient = (field) => (val) => update("patient", field, val);
  const payerAndUrgencyChosen = Boolean(payer.name) && Boolean(payer.urgency);
  // Tracks whichever patient-on-record was last selected, purely so the payer-mismatch
  // nudge below knows which other payer to offer — cleared whenever First/Last Name is
  // fully cleared (see onTypePatientName) or a different record is picked.
  const [matchedPatient, setMatchedPatient] = useState(null);

  const onSelectAddress = (addr) => {
    update("patient", "streetAddress", addr.street);
    update("patient", "city", addr.city);
    update("patient", "state", addr.state);
    update("patient", "zip", addr.zip);
  };

  // Typing over a previously-matched address (rather than picking a new one) invalidates
  // City/State/ZIP that came from it — they clear until a match is picked again.
  const onTypeStreetAddress = (val) => {
    setPatient("streetAddress")(val);
    setPatient("city")("");
    setPatient("state")("");
    setPatient("zip")("");
  };

  // Selecting a matching patient on record prepopulates everything we already have for
  // them — name, date of birth, gender, and address. Member ID only comes along if the
  // patient's on-record payer is the SAME payer selected above — a Member ID belongs to a
  // specific payer relationship, so carrying it over under a different payer would be wrong.
  // If it's a different payer, we don't just silently skip it — see the nudge below, since
  // the same patient can genuinely have more than one insurance on file.
  const onSelectPatientRecord = (p) => {
    const [first, ...rest] = p.name.split(" ");
    update("patient", "firstName", first);
    update("patient", "lastName", rest.join(" "));
    update("patient", "dob", p.dobIso);
    update("patient", "gender", p.gender);
    update("patient", "streetAddress", p.streetAddress);
    update("patient", "suite", p.suite);
    update("patient", "city", p.city);
    update("patient", "state", p.state);
    update("patient", "zip", p.zip);
    setMatchedPatient(p);
    if (p.payerName && p.payerName === payer.name) {
      update("patient", "memberId", p.memberId);
    }
  };

  // First/Last Name are the two fields that can trigger a patient-record match — clearing
  // either one all the way back to empty means "start over on who this patient is," so
  // everything that came from that match (not just the name) clears with it. Typing
  // something new that's still non-empty is left alone; picking a fresh match overwrites
  // it normally through onSelectPatientRecord above.
  const onTypePatientName = (field) => (val) => {
    setPatient(field)(val);
    if (val.trim() === "") {
      update("patient", "dob", "");
      update("patient", "gender", "");
      update("patient", "memberId", "");
      update("patient", "streetAddress", "");
      update("patient", "suite", "");
      update("patient", "city", "");
      update("patient", "state", "");
      update("patient", "zip", "");
      setMatchedPatient(null);
    }
  };

  // A patient can genuinely carry more than one insurance — this is a nudge toward the
  // Member ID we already have on file for them, not a hard rule that the payer was wrong.
  const payerMismatch = matchedPatient && matchedPatient.payerName && matchedPatient.payerName !== payer.name;
  const useOnRecordPayer = () => {
    update("payer", "name", matchedPatient.payerName);
    update("patient", "memberId", matchedPatient.memberId);
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Payer</h3>
      <div className="grid grid-cols-2 gap-5">
        <SearchableSelectField
          label="Payer (Insurance)"
          required
          value={payer.name}
          onChange={(v) => update("payer", "name", v)}
          minChars={1}
          placeholder="Search a payer — e.g. Blue, BCBS"
          error={errors["payer.name"]}
          getMatches={(q) => PAYER_LIST.filter((p) => matchesPayerQuery(p, q))}
          getMatchLabel={(p) => p.name}
          onSelect={(p) => update("payer", "name", p.name)}
          renderMatch={(p) => <span className="text-slate-700">{p.name}</span>}
        />
        <SelectField label="Urgency" required value={payer.urgency} onChange={(v) => update("payer", "urgency", v)} options={["Urgent", "Not Urgent"]} error={errors["payer.urgency"]} />
      </div>
      {selectedPayer && (
        <div className="flex items-start gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-xs text-indigo-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          {selectedPayer.type === "Pharmacy Only"
            ? "This payer supports only Pharmacy PA."
            : selectedPayer.type === "Medical Only"
            ? "This payer supports only Medical PA."
            : "This payer supports both Medical and Pharmacy PA."}
        </div>
      )}

      {!payerAndUrgencyChosen && (
        <p className="rounded-md border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">Select a Payer and Urgency above to continue to Patient Information.</p>
      )}

      {payerAndUrgencyChosen && (
        <>
          <SectionDivider label="Patient Information" />
          <div className="grid grid-cols-2 gap-5">
            <SearchableSelectField
              label="First Name"
              required
              format="alpha"
              value={patient.firstName}
              onChange={onTypePatientName("firstName")}
              minChars={2}
              placeholder="Start typing — matches existing patients on record"
              error={errors["patient.firstName"]}
              getMatches={(q) => PATIENTS.filter((p) => p.name.split(" ")[0].toLowerCase().includes(q.toLowerCase()))}
              getMatchLabel={(p) => p.mrn}
              onSelect={onSelectPatientRecord}
              renderMatch={(p) => (
                <>
                  <span className="font-medium text-slate-700">{p.name}</span>
                  <span className="text-xs text-slate-400">
                    On record — DOB {p.dob} · {p.streetAddress}, {p.city}, {p.state}
                  </span>
                </>
              )}
            />
            <SearchableSelectField
              label="Last Name"
              required
              format="alpha"
              value={patient.lastName}
              onChange={onTypePatientName("lastName")}
              minChars={2}
              placeholder="Start typing — matches existing patients on record"
              error={errors["patient.lastName"]}
              getMatches={(q) => PATIENTS.filter((p) => p.name.split(" ").slice(1).join(" ").toLowerCase().includes(q.toLowerCase()))}
              getMatchLabel={(p) => p.mrn}
              onSelect={onSelectPatientRecord}
              renderMatch={(p) => (
                <>
                  <span className="font-medium text-slate-700">{p.name}</span>
                  <span className="text-xs text-slate-400">
                    On record — DOB {p.dob} · {p.streetAddress}, {p.city}, {p.state}
                  </span>
                </>
              )}
            />
            <TextField label="Date of Birth" required type="date" value={patient.dob} onChange={setPatient("dob")} error={errors["patient.dob"]} />
            <SelectField label="Gender" required value={patient.gender} onChange={setPatient("gender")} options={["Female", "Male", "Non-binary", "Prefer not to say"]} placeholder="Select Gender" error={errors["patient.gender"]} />
            <TextField label="Member ID (PBM Member ID / Cardholder ID)" required format="alphanumeric" value={patient.memberId} onChange={setPatient("memberId")} error={errors["patient.memberId"]} />
          </div>
          {payerMismatch && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
              <Info size={14} className="mt-0.5 shrink-0" />
              <div>
                On record — {matchedPatient.name} has an insurance with <strong>{matchedPatient.payerName}</strong>. Would you like to use that
                instead?
                <button type="button" onClick={useOnRecordPayer} className="ml-2 font-semibold text-amber-800 underline hover:text-amber-900">
                  Use {matchedPatient.payerName}
                </button>
              </div>
            </div>
          )}
          <SectionDivider label="Address" />
          <div className="grid grid-cols-2 gap-5">
            <AddressSearchField value={patient.streetAddress} onChange={onTypeStreetAddress} onSelectAddress={onSelectAddress} error={errors["patient.streetAddress"]} />
            <TextField label="House/Unit/Apartment Number" value={patient.suite} onChange={setPatient("suite")} />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <TextField label="City" required format="alpha" value={patient.city} onChange={setPatient("city")} placeholder="From address" error={errors["patient.city"]} />
            <SelectField label="State" required value={patient.state} onChange={setPatient("state")} options={US_STATES} placeholder="From address" error={errors["patient.state"]} />
            <TextField label="ZIP" required format="numeric" value={patient.zip} onChange={setPatient("zip")} placeholder="From address" error={errors["patient.zip"]} />
          </div>
        </>
      )}
    </div>
  );
}

// Clear segmented control instead of an easy-to-miss checkbox — it's immediately obvious
// which state is selected, and what picking "Different" will reveal below.
function SameAsToggle({ label, checked, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="inline-flex rounded-md border border-slate-200 p-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded px-4 py-1.5 text-sm font-medium transition ${checked ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
        >
          Same as Prescriber
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded px-4 py-1.5 text-sm font-medium transition ${!checked ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
        >
          Different
        </button>
      </div>
    </div>
  );
}

function ProviderFieldSet({ d, set, prefix, errors = {}, showEmail = false }) {
  const onLookupNpi = () => {
    const match = NPI_DATABASE[d.npi.trim()];
    if (!match) return;
    set("firstName")(match.firstName);
    set("lastName")(match.lastName);
    set("licenseState")(match.licenseState);
    set("licenseNumber")(match.licenseNumber);
    set("streetAddress")(match.streetAddress);
    set("suite")(match.suite);
    set("city")(match.city);
    set("state")(match.state);
    set("zip")(match.zip);
  };

  // Editing the NPI away from whatever was last looked up invalidates the name/license/
  // address that came from it — they clear until Lookup is run again on the new number.
  const onNpiChange = (val) => {
    set("npi")(val);
    set("firstName")("");
    set("lastName")("");
    set("licenseState")("");
    set("licenseNumber")("");
    set("streetAddress")("");
    set("suite")("");
    set("city")("");
    set("state")("");
    set("zip")("");
  };

  const e = (field) => errors[`${prefix}.${field}`];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <NpiLookupField value={d.npi} onChange={onNpiChange} onLookup={onLookupNpi} error={e("npi")} hint="Try 1234567890, 1922334455, or 1015049598 — lookup prepopulates name and address below." />
        <div />
        <TextField label="First Name" required format="alpha" value={d.firstName} onChange={set("firstName")} placeholder="Prepopulated from NPI" error={e("firstName")} />
        <TextField label="Last Name" required format="alpha" value={d.lastName} onChange={set("lastName")} placeholder="Prepopulated from NPI" error={e("lastName")} />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <SelectField label="License State" value={d.licenseState} onChange={set("licenseState")} options={US_STATES} placeholder="Prepopulated from NPI" error={e("licenseState")} />
        <TextField label="License Number" format="alphanumeric" value={d.licenseNumber} onChange={set("licenseNumber")} placeholder="Prepopulated from NPI" error={e("licenseNumber")} />
        <TextField label="Tax ID (TIN)" required format="alphanumeric" value={d.taxId} onChange={set("taxId")} error={e("taxId")} />
      </div>
      <div>
        <p className={`mb-1.5 flex items-center gap-1.5 text-xs ${e("phoneOrFax") ? "font-medium text-red-600" : "text-slate-400"}`}>
          {e("phoneOrFax") && <AlertTriangle size={12} className="shrink-0" />}
          At least one of Phone # or Fax # is required — neither is mandatory on its own.
        </p>
        <div className="grid grid-cols-2 gap-5">
          <PhoneField label="Phone #" typeValue={d.phoneType} phoneValue={d.phone} onTypeChange={set("phoneType")} onPhoneChange={set("phone")} error={e("phone")} />
          <FaxField label="Fax #" typeValue={d.faxType} faxValue={d.fax} onTypeChange={set("faxType")} onFaxChange={set("fax")} error={e("fax")} />
        </div>
      </div>
      {showEmail && (
        <div className="grid grid-cols-2 gap-5">
          <TextField label="Email" required type="email" format="email" value={d.email} onChange={set("email")} placeholder="prescriber@example.com" error={e("email")} />
          <TextField label="Confirm Email" required type="email" format="email" value={d.confirmEmail} onChange={set("confirmEmail")} placeholder="Re-enter the email above" error={e("confirmEmail")} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-5">
        <TextField label="Street Address" required value={d.streetAddress} onChange={set("streetAddress")} placeholder="Prepopulated from NPI" error={e("streetAddress")} />
        <TextField label="House/Unit/Apartment Number" value={d.suite} onChange={set("suite")} />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <TextField label="City" required format="alpha" value={d.city} onChange={set("city")} placeholder="Prepopulated from NPI" error={e("city")} />
        <SelectField label="State" required value={d.state} onChange={set("state")} options={US_STATES} placeholder="Select State" error={e("state")} />
        <TextField label="ZIP" required format="numeric" value={d.zip} onChange={set("zip")} placeholder="Prepopulated from NPI" error={e("zip")} />
      </div>
    </div>
  );
}

function PrescriberAndServicingProviderTab({ data, update, errors = {} }) {
  const prescriber = data.prescriber;
  const servicing = data.servicingProvider;
  const setPrescriber = (field) => (val) => update("prescriber", field, val);
  const setServicing = (field) => (val) => update("servicingProvider", field, val);

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Prescriber Information</h3>
      <ProviderFieldSet d={prescriber} set={setPrescriber} prefix="prescriber" errors={errors} showEmail />

      <div className="mt-2">
        <SameAsToggle label="Is the Servicing Provider the same as the Prescriber?" checked={servicing.sameAsPrescriber} onChange={setServicing("sameAsPrescriber")} />
      </div>

      {!servicing.sameAsPrescriber && (
        <>
          <SectionDivider label="Servicing Provider" />
          <ProviderFieldSet d={servicing} set={setServicing} prefix="servicingProvider" errors={errors} />
        </>
      )}
    </div>
  );
}

function PharmacyTab({ data, update, errors = {} }) {
  const d = data.pharmacy;
  const set = (field) => (val) => update("pharmacy", field, val);
  const e = (field) => errors[`pharmacy.${field}`];

  const onLookupNpi = () => {
    const match = PHARMACY_NPI_DATABASE[d.npi.trim()];
    if (!match) return;
    set("businessName")(match.businessName);
    set("ncpdpId")(match.ncpdpId);
    set("streetAddress")(match.streetAddress);
    set("suite")(match.suite);
    set("city")(match.city);
    set("state")(match.state);
    set("zip")(match.zip);
  };

  // Same cascade-clear pattern as Prescriber/Servicing Provider — editing the NPI away
  // from what was looked up invalidates everything that came from it.
  const onNpiChange = (val) => {
    set("npi")(val);
    set("businessName")("");
    set("ncpdpId")("");
    set("streetAddress")("");
    set("suite")("");
    set("city")("");
    set("state")("");
    set("zip")("");
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Pharmacy</h3>
      <div className="grid grid-cols-2 gap-5">
        <NpiLookupField value={d.npi} onChange={onNpiChange} onLookup={onLookupNpi} error={e("npi")} hint="Try 1922334455, 1699887766, or 1477665544 — lookup prepopulates the pharmacy details below." />
        <div />
        <TextField label="NCPDP ID" required format="alphanumeric" value={d.ncpdpId} onChange={set("ncpdpId")} placeholder="Prepopulated from NPI" error={e("ncpdpId")} />
        <TextField label="Pharmacy Name" required value={d.businessName} onChange={set("businessName")} placeholder="Prepopulated from NPI" error={e("businessName")} />
      </div>
      <div>
        <p className={`mb-1.5 flex items-center gap-1.5 text-xs ${e("phoneOrFax") ? "font-medium text-red-600" : "text-slate-400"}`}>
          {e("phoneOrFax") && <AlertTriangle size={12} className="shrink-0" />}
          At least one of Phone # or Fax # is required — neither is mandatory on its own.
        </p>
        <div className="grid grid-cols-2 gap-5">
          <PhoneField label="Phone #" typeValue={d.phoneType} phoneValue={d.phone} onTypeChange={set("phoneType")} onPhoneChange={set("phone")} error={e("phone")} />
          <FaxField label="Fax #" typeValue={d.faxType} faxValue={d.fax} onTypeChange={set("faxType")} onFaxChange={set("fax")} error={e("fax")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <TextField label="Street Address" required value={d.streetAddress} onChange={set("streetAddress")} placeholder="Prepopulated from NPI" error={e("streetAddress")} />
        <TextField label="House/Unit/Apartment Number" value={d.suite} onChange={set("suite")} />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <TextField label="City" required format="alpha" value={d.city} onChange={set("city")} placeholder="Prepopulated from NPI" error={e("city")} />
        <SelectField label="State" required value={d.state} onChange={set("state")} options={US_STATES} placeholder="Select State" error={e("state")} />
        <TextField label="ZIP" required format="numeric" value={d.zip} onChange={set("zip")} placeholder="Prepopulated from NPI" error={e("zip")} />
      </div>
    </div>
  );
}

function DrugDetailsTab({ data, update, errors = {} }) {
  const d = data.prescription;
  const set = (field) => (val) => update("prescription", field, val);
  const payerType = PAYER_LIST.find((p) => p.name === data.payer.name)?.type;
  // Pharmacy Only and Medical Only payers each only support one PA path, so Buy and Bill
  // isn't a real choice for either — it's locked to whichever path the payer actually
  // supports. "Medical + Pharmacy" payers are the only ones where the Partner picks.
  const lockedBuyAndBill = payerType === "Pharmacy Only" ? "No" : payerType === "Medical Only" ? "Yes" : null;
  const buyAndBillLocked = lockedBuyAndBill !== null;
  const selectedDrug = DRUG_DATABASE.find((x) => x.label === d.drugDescription);
  const routeOptions = selectedDrug?.route || [];

  // Keeps the underlying data in sync with what's actually displayed — without this, a
  // locked payer would show "No"/"Yes" on screen while the real stored value stayed empty,
  // which would incorrectly hide the Pharmacy tab (it only shows when buyAndBill is
  // genuinely "No") or misrepresent the case on Summary.
  useEffect(() => {
    if (lockedBuyAndBill && d.buyAndBill !== lockedBuyAndBill) {
      update("prescription", "buyAndBill", lockedBuyAndBill);
    }
  }, [lockedBuyAndBill, d.buyAndBill]);

  // Any one of Drug Description / NDC / HCPCS-CPT Code identifies the same DRUG_DATABASE
  // row — selecting a match from any of the three populates all three, plus Route (still
  // editable — locked only in the sense that it starts prepopulated) and Dosage/Unit,
  // parsed straight from the drug's own description string. Dosage and Unit stay as
  // internal data (shown combined on the Summary) — there's no separate input for either,
  // since the description string already carries both.
  const onSelectDrug = (drug) => {
    const parsed = parseDosageFromLabel(drug.label);
    update("prescription", "drugDescription", drug.label);
    update("prescription", "ndc", drug.ndc);
    update("prescription", "jCode", drug.jCode);
    update("prescription", "route", drug.route.length === 1 ? drug.route[0] : "");
    update("prescription", "dosage", parsed.dosage);
    update("prescription", "unit", parsed.unit);
    update("prescription", "directions", "");
    update("prescription", "quantity", "");
  };

  // Typing directly into any of the three identifying fields (as opposed to picking a
  // match) invalidates whatever was previously resolved — every field that was
  // prepopulated from the old match clears, so nothing stale is left behind.
  const clearDrugMatch = (exceptField) => {
    ["drugDescription", "ndc", "jCode"].filter((f) => f !== exceptField).forEach((f) => update("prescription", f, ""));
    update("prescription", "route", "");
    update("prescription", "dosage", "");
    update("prescription", "unit", "");
    update("prescription", "directions", "");
    update("prescription", "quantity", "");
  };
  const onTypeDrugField = (field) => (val) => {
    set(field)(val);
    clearDrugMatch(field);
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-bold text-slate-900">Drug Details</h3>

      {/* Bidirectional drug identification — any one of these three prepopulates the other two */}
      <div className="grid grid-cols-3 gap-5">
        <DrugSearchField label="Drug Description" drugKey="label" value={d.drugDescription} onChange={onTypeDrugField("drugDescription")} onSelectDrug={onSelectDrug} minChars={3} placeholder="Type at least 3 letters — e.g. tyl" error={errors["prescription.drugDescription"]} />
        <DrugSearchField label="NDC (Product Code)" drugKey="ndc" value={d.ndc} onChange={onTypeDrugField("ndc")} onSelectDrug={onSelectDrug} minChars={3} placeholder="Or start typing an NDC" error={errors["prescription.ndc"]} />
        <DrugSearchField label="HCPCS/CPT Code" drugKey="jCode" value={d.jCode} onChange={onTypeDrugField("jCode")} onSelectDrug={onSelectDrug} minChars={2} placeholder="Or start typing a code" error={errors["prescription.jCode"]} />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {routeOptions.length > 1 ? (
          <SelectField label="Route of Administration" required value={d.route} onChange={set("route")} options={routeOptions} placeholder="Select Route" error={errors["prescription.route"]} />
        ) : (
          <TextField label="Route of Administration" required value={d.route} onChange={set("route")} placeholder="Prepopulated once a drug is selected" error={errors["prescription.route"]} />
        )}
        <TextField label="Start Date of Service" required type="date" value={d.startDateOfService} onChange={set("startDateOfService")} error={errors["prescription.startDateOfService"]} />
      </div>

      <SectionDivider label="Directions" />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Directions</label>
        <textarea
          value={d.directions}
          onChange={(e) => set("directions")(e.target.value)}
          rows={3}
          placeholder="Optional — type the directions for use, e.g. Inject 100 units intramuscularly once every 12 weeks"
          className={`w-full rounded-md border px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none ${
            errors["prescription.directions"] ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400"
          }`}
        />
        <p className="mt-1 text-xs text-slate-400">Free text — AnvayaRx is not yet connected to a data feed for FDB SIG codes/directions for this field.</p>
        <FieldError message={errors["prescription.directions"]} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <TextField label="Days Supply" required format="numeric" value={d.daysSupply} onChange={set("daysSupply")} error={errors["prescription.daysSupply"]} />
        <TextField label="Quantity" required format="numeric" value={d.quantity} onChange={set("quantity")} error={errors["prescription.quantity"]} />
        {buyAndBillLocked ? (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Buy and Bill</label>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
              {lockedBuyAndBill} — this payer supports {payerType === "Pharmacy Only" ? "Pharmacy" : "Medical"} PA only
            </div>
          </div>
        ) : (
          <SelectField label="Buy and Bill" required value={d.buyAndBill} onChange={set("buyAndBill")} options={["Yes", "No"]} placeholder="Select" error={errors["prescription.buyAndBill"]} />
        )}
      </div>

      {/* Always visible and mandatory — this is the independent signal for medical vs.
          pharmacy benefit, not something conditional on the Buy and Bill answer. */}
      <div className="grid grid-cols-2 gap-5">
        <SelectField
          label="Drug Administered Location"
          required
          value={d.administeredLocation}
          onChange={set("administeredLocation")}
          options={DRUG_ADMINISTERED_LOCATIONS}
          placeholder="Select Location"
          error={errors["prescription.administeredLocation"]}
        />
        {d.administeredLocation === "Other" && (
          <TextField label="Describe Other" required value={d.administeredLocationOther} onChange={set("administeredLocationOther")} placeholder="Describe other location" error={errors["prescription.administeredLocationOther"]} />
        )}
      </div>

      <SectionDivider label="Allergies" />
      <AllergySearchField
        value={d.allergyQuery}
        onChange={(v) => {
          update("prescription", "allergyQuery", v);
          update("prescription", "allergyCode", "");
        }}
        onSelectAllergy={(a) => {
          update("prescription", "allergyQuery", `${a.label} (Code ${a.code})`);
          update("prescription", "allergyCode", a.code);
        }}
      />

      <SectionDivider label="Diagnosis" />
      <div className="grid grid-cols-2 gap-5">
        <Icd10SearchField
          label="Diagnosis Code (ICD-10)"
          required
          value={d.icd10Query}
          error={errors["prescription.icd10Code"]}
          onChange={(v) => {
            update("prescription", "icd10Query", v);
            update("prescription", "icd10Code", "");
          }}
          onSelectCode={(c) => {
            update("prescription", "icd10Query", `${c.code} — ${c.label}`);
            update("prescription", "icd10Code", c.code);
          }}
        />
        <Icd10SearchField
          label="Other Diagnosis Code (if applicable)"
          value={d.otherIcd10Query}
          onChange={(v) => {
            update("prescription", "otherIcd10Query", v);
            update("prescription", "otherIcd10Code", "");
          }}
          onSelectCode={(c) => {
            update("prescription", "otherIcd10Query", `${c.code} — ${c.label}`);
            update("prescription", "otherIcd10Code", c.code);
          }}
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, small }) {
  if (!value) return null;
  return (
    <div className={`flex flex-col gap-0.5 rounded-md bg-slate-50 ${small ? "px-3 py-1.5" : "px-4 py-2.5"}`}>
      <span className={`font-medium text-slate-500 ${small ? "text-[10px]" : "text-xs"}`}>{label}</span>
      <span className={`font-semibold text-slate-800 ${small ? "text-xs" : "text-base"}`}>{value}</span>
    </div>
  );
}

function SummarySection({ title, onEdit, children }) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        <button onClick={onEdit} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
          <Pencil size={12} /> Edit
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </Card>
  );
}

function SummaryTab({ data, onJumpToTab }) {
  const payer = data.payer;
  const patient = data.patient;
  const prescriber = data.prescriber;
  const servicing = data.servicingProvider;
  const pharmacy = data.pharmacy;
  const rx = data.prescription;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">Review everything entered below. Click Edit on any section to make changes, then come back here and submit.</p>

      <SummarySection title="Payer & Patient Information" onEdit={() => onJumpToTab("Payer & Patient Information")}>
        <SummaryRow label="Payer" value={payer.name} />
        <SummaryRow label="Urgency" value={payer.urgency} />
        <SummaryRow label="Patient" value={[patient.firstName, patient.lastName].filter(Boolean).join(" ")} />
        <SummaryRow label="Date of Birth" value={patient.dob} />
        <SummaryRow label="Gender" value={patient.gender} />
        <SummaryRow label="Member ID" value={patient.memberId} />
        <SummaryRow label="Address" value={[patient.streetAddress, patient.suite, patient.city, patient.state, patient.zip].filter(Boolean).join(", ")} />
      </SummarySection>

      <SummarySection title="Prescriber & Servicing Provider" onEdit={() => onJumpToTab("Prescriber & Servicing Provider")}>
        <div className="w-full rounded-lg border border-slate-200 p-3.5">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-500">Prescriber</p>
          <div className="flex flex-wrap gap-2.5">
            <SummaryRow label="Name" value={[prescriber.firstName, prescriber.lastName].filter(Boolean).join(" ")} />
            <SummaryRow label="NPI" value={prescriber.npi} />
            <SummaryRow label="License" value={[prescriber.licenseState, prescriber.licenseNumber].filter(Boolean).join(" — ")} />
            <SummaryRow label="Tax ID (TIN)" value={prescriber.taxId} />
            <SummaryRow label="Phone" value={prescriber.phone ? `${prescriber.phoneType}: ${prescriber.phone}` : ""} />
            <SummaryRow label="Fax" value={prescriber.fax ? `${prescriber.faxType}: ${prescriber.fax}` : ""} />
            <SummaryRow label="Email" value={prescriber.email} />
            <SummaryRow label="Address" value={[prescriber.streetAddress, prescriber.suite, prescriber.city, prescriber.state, prescriber.zip].filter(Boolean).join(", ")} />
          </div>
        </div>
        <div className="w-full rounded-lg border border-slate-200 p-3.5">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-500">Servicing Provider</p>
          {servicing.sameAsPrescriber ? (
            <p className="text-sm font-semibold text-slate-700">Same as Prescriber</p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              <SummaryRow label="Name" value={[servicing.firstName, servicing.lastName].filter(Boolean).join(" ")} />
              <SummaryRow label="NPI" value={servicing.npi} />
              <SummaryRow label="License" value={[servicing.licenseState, servicing.licenseNumber].filter(Boolean).join(" — ")} />
              <SummaryRow label="Tax ID (TIN)" value={servicing.taxId} />
              <SummaryRow label="Phone" value={servicing.phone ? `${servicing.phoneType}: ${servicing.phone}` : ""} />
              <SummaryRow label="Fax" value={servicing.fax ? `${servicing.faxType}: ${servicing.fax}` : ""} />
              <SummaryRow label="Address" value={[servicing.streetAddress, servicing.suite, servicing.city, servicing.state, servicing.zip].filter(Boolean).join(", ")} />
            </div>
          )}
        </div>
      </SummarySection>

      <SummarySection title="Drug Details" onEdit={() => onJumpToTab("Drug Details")}>
        <SummaryRow label="Drug" value={rx.drugDescription} />
        <SummaryRow label="NDC" value={rx.ndc} />
        <SummaryRow label="HCPCS/CPT Code" value={rx.jCode} />
        <SummaryRow label="Route" value={rx.route} />
        <SummaryRow label="Directions" value={rx.directions} />
        <SummaryRow label="Dosage" value={rx.dosage && rx.unit ? `${rx.dosage} ${rx.unit}` : ""} />
        <SummaryRow label="Start Date of Service" value={rx.startDateOfService} />
        <SummaryRow label="Days Supply" value={rx.daysSupply} />
        <SummaryRow label="Quantity" value={rx.quantity} />
        <SummaryRow label="Buy and Bill" value={rx.buyAndBill} />
        <SummaryRow label="Drug Administered Location" value={rx.administeredLocation === "Other" ? rx.administeredLocationOther : rx.administeredLocation} />
        <SummaryRow label="Allergies" value={rx.allergyQuery} />
        <SummaryRow label="Diagnosis (ICD-10)" value={rx.icd10Query} />
        <SummaryRow label="Other Diagnosis" value={rx.otherIcd10Query} />
      </SummarySection>

      {rx.buyAndBill === "No" && (
        <SummarySection title="Pharmacy" onEdit={() => onJumpToTab("Pharmacy")}>
          <SummaryRow label="Pharmacy Name" value={pharmacy.businessName} />
          <SummaryRow label="NPI" value={pharmacy.npi} />
          <SummaryRow label="NCPDP ID" value={pharmacy.ncpdpId} />
          <SummaryRow label="Phone" value={pharmacy.phone ? `${pharmacy.phoneType}: ${pharmacy.phone}` : ""} />
          <SummaryRow label="Fax" value={pharmacy.fax ? `${pharmacy.faxType}: ${pharmacy.fax}` : ""} />
          <SummaryRow label="Address" value={[pharmacy.streetAddress, pharmacy.suite, pharmacy.city, pharmacy.state, pharmacy.zip].filter(Boolean).join(", ")} />
        </SummarySection>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Enrollment form shell (shared by New Enrollment + Update Case)
// ---------------------------------------------------------------------------

function EnrollmentBreadcrumbs({ tabs, activeTab, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-6 py-5">
      {tabs.map((tab, idx) => {
        const state = idx < activeTab ? "done" : idx === activeTab ? "current" : "upcoming";
        return (
          <React.Fragment key={tab}>
            {idx > 0 && <ChevronRight size={20} className="mx-1 shrink-0 text-slate-300" />}
            <button
              onClick={() => onSelect(idx)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-base font-semibold transition ${
                state === "current"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : state === "done"
                  ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {state === "done" ? <CheckCircle2 size={18} /> : <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${state === "current" ? "bg-white/20" : "bg-slate-200"}`}>{idx + 1}</span>}
              {tab}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Per-tab required-field + format rules, used to gate navigation to the next tab and to
// surface "X is missing" / format errors directly on the offending fields.
function buildValidationRules(tabName, data) {
  const patient = data.patient;
  const prescriber = data.prescriber;
  const servicing = data.servicingProvider;
  const rx = data.prescription;
  const pharmacy = data.pharmacy;

  switch (tabName) {
    case "Payer & Patient Information":
      return [
        { key: "payer.name", label: "Payer", value: data.payer.name, required: true },
        { key: "payer.urgency", label: "Urgency", value: data.payer.urgency, required: true },
        { key: "patient.firstName", label: "First Name", value: patient.firstName, required: true, format: "alpha" },
        { key: "patient.lastName", label: "Last Name", value: patient.lastName, required: true, format: "alpha" },
        { key: "patient.dob", label: "Date of Birth", value: patient.dob, required: true },
        { key: "patient.gender", label: "Gender", value: patient.gender, required: true },
        { key: "patient.memberId", label: "Member ID", value: patient.memberId, required: true, format: "alphanumeric" },
        { key: "patient.streetAddress", label: "Street Address", value: patient.streetAddress, required: true },
        { key: "patient.city", label: "City", value: patient.city, required: true, format: "alpha" },
        { key: "patient.state", label: "State", value: patient.state, required: true },
        { key: "patient.zip", label: "ZIP", value: patient.zip, required: true, format: "zip" },
      ];

    case "Prescriber & Servicing Provider": {
      const rules = [
        { key: "prescriber.npi", label: "NPI #", value: prescriber.npi, required: true, format: "npi" },
        { key: "prescriber.firstName", label: "First Name", value: prescriber.firstName, required: true, format: "alpha" },
        { key: "prescriber.lastName", label: "Last Name", value: prescriber.lastName, required: true, format: "alpha" },
        { key: "prescriber.licenseState", label: "License State", value: prescriber.licenseState, required: false },
        { key: "prescriber.licenseNumber", label: "License Number", value: prescriber.licenseNumber, required: false, format: "alphanumeric" },
        { key: "prescriber.taxId", label: "Tax ID (TIN)", value: prescriber.taxId, required: true, format: "alphanumeric" },
        { key: "prescriber.streetAddress", label: "Street Address", value: prescriber.streetAddress, required: true },
        { key: "prescriber.city", label: "City", value: prescriber.city, required: true, format: "alpha" },
        { key: "prescriber.state", label: "State", value: prescriber.state, required: true },
        { key: "prescriber.zip", label: "ZIP", value: prescriber.zip, required: true, format: "zip" },
        { key: "prescriber.phone", label: "Phone #", value: prescriber.phone, required: false, format: "numeric" },
        { key: "prescriber.fax", label: "Fax #", value: prescriber.fax, required: false, format: "numeric" },
        { key: "prescriber.phoneOrFax", label: "Phone # or Fax #", value: prescriber.phone || prescriber.fax, required: true },
        { key: "prescriber.email", label: "Email", value: prescriber.email, required: true, format: "email" },
        {
          key: "prescriber.confirmEmail",
          label: "Confirm Email",
          value: prescriber.confirmEmail,
          required: true,
          format: "email",
          matchValue: prescriber.email,
          matchLabel: "Email",
        },
      ];
      if (!servicing.sameAsPrescriber) {
        rules.push(
          { key: "servicingProvider.npi", label: "NPI #", value: servicing.npi, required: true, format: "npi" },
          { key: "servicingProvider.firstName", label: "First Name", value: servicing.firstName, required: true, format: "alpha" },
          { key: "servicingProvider.lastName", label: "Last Name", value: servicing.lastName, required: true, format: "alpha" },
          { key: "servicingProvider.licenseState", label: "License State", value: servicing.licenseState, required: false },
          { key: "servicingProvider.licenseNumber", label: "License Number", value: servicing.licenseNumber, required: false, format: "alphanumeric" },
          { key: "servicingProvider.taxId", label: "Tax ID (TIN)", value: servicing.taxId, required: true, format: "alphanumeric" },
          { key: "servicingProvider.streetAddress", label: "Street Address", value: servicing.streetAddress, required: true },
          { key: "servicingProvider.city", label: "City", value: servicing.city, required: true, format: "alpha" },
          { key: "servicingProvider.state", label: "State", value: servicing.state, required: true },
          { key: "servicingProvider.zip", label: "ZIP", value: servicing.zip, required: true, format: "zip" },
          { key: "servicingProvider.phone", label: "Phone #", value: servicing.phone, required: false, format: "numeric" },
          { key: "servicingProvider.fax", label: "Fax #", value: servicing.fax, required: false, format: "numeric" },
          { key: "servicingProvider.phoneOrFax", label: "Phone # or Fax #", value: servicing.phone || servicing.fax, required: true }
        );
      }
      return rules;
    }

    case "Drug Details": {
      const payerType = PAYER_LIST.find((p) => p.name === data.payer.name)?.type;
      const rules = [
        { key: "prescription.drugDescription", label: "Drug Description", value: rx.drugDescription, required: true },
        { key: "prescription.ndc", label: "NDC", value: rx.ndc, required: true },
        { key: "prescription.jCode", label: "HCPCS/CPT Code", value: rx.jCode, required: true, format: "alphanumeric" },
        { key: "prescription.route", label: "Route of Administration", value: rx.route, required: true, format: "alpha" },
        { key: "prescription.startDateOfService", label: "Start Date of Service", value: rx.startDateOfService, required: true },
        { key: "prescription.directions", label: "Directions", value: rx.directions, required: false },
        { key: "prescription.daysSupply", label: "Days Supply", value: rx.daysSupply, required: true, format: "numeric" },
        { key: "prescription.quantity", label: "Quantity", value: rx.quantity, required: true, format: "numeric" },
        { key: "prescription.administeredLocation", label: "Drug Administered Location", value: rx.administeredLocation, required: true },
        { key: "prescription.icd10Code", label: "Diagnosis Code (ICD-10)", value: rx.icd10Code, required: true },
      ];
      if (payerType !== "Pharmacy Only" && payerType !== "Medical Only") {
        rules.push({ key: "prescription.buyAndBill", label: "Buy and Bill", value: rx.buyAndBill, required: true });
      }
      if (rx.administeredLocation === "Other") {
        rules.push({ key: "prescription.administeredLocationOther", label: "Describe Other", value: rx.administeredLocationOther, required: true });
      }
      return rules;
    }

    case "Pharmacy":
      return [
        { key: "pharmacy.npi", label: "NPI #", value: pharmacy.npi, required: true, format: "npi" },
        { key: "pharmacy.ncpdpId", label: "NCPDP ID", value: pharmacy.ncpdpId, required: true, format: "alphanumeric" },
        { key: "pharmacy.businessName", label: "Pharmacy Name", value: pharmacy.businessName, required: true },
        { key: "pharmacy.streetAddress", label: "Street Address", value: pharmacy.streetAddress, required: true },
        { key: "pharmacy.city", label: "City", value: pharmacy.city, required: true, format: "alpha" },
        { key: "pharmacy.state", label: "State", value: pharmacy.state, required: true },
        { key: "pharmacy.zip", label: "ZIP", value: pharmacy.zip, required: true, format: "zip" },
        { key: "pharmacy.phone", label: "Phone #", value: pharmacy.phone, required: false, format: "numeric" },
        { key: "pharmacy.fax", label: "Fax #", value: pharmacy.fax, required: false, format: "numeric" },
        { key: "pharmacy.phoneOrFax", label: "Phone # or Fax #", value: pharmacy.phone || pharmacy.fax, required: true },
      ];

    case "Summary":
    default:
      return [];
  }
}

function EnrollmentForm({ mode, caseItem, enrollmentId, onBack, onSaveDraft, savedFormData, onCreateEnrollment }) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(() => {
    if (savedFormData) return savedFormData;
    return mode === "create" ? emptyEnrollmentData() : mockEnrollmentDataFromCase(caseItem);
  });
  const [errors, setErrors] = useState({});
  const [justSaved, setJustSaved] = useState(false);
  // idle | submitting | success | error — drives the Create Enrollment flow specifically.
  // "submitting" covers NDC–Drug Description verification, Program assignment, enrollment
  // package assembly, and the POST to Agadia; only Agadia's 2xx response moves this to
  // "success" and actually creates the Case (Section 3.4.1/3.4.2) — matching the API
  // channel's real sequence rather than creating the Case optimistically on the UI side.
  const [submissionState, setSubmissionState] = useState("idle");
  const [createdCase, setCreatedCase] = useState(null);
  // Smart-scroll gate for the Summary tab — Create Enrollment stays disabled and pinned
  // at the top until the person has actually scrolled through the whole summary, rather
  // than trusting that a visible-but-unscrolled screen was actually read.
  const [summaryReviewed, setSummaryReviewed] = useState(false);

  // Pharmacy only appears once the Partner has explicitly answered No to Buy and Bill —
  // before that answer, and whenever it is Yes, there is no pharmacy step to show.
  const visibleTabs = ENROLLMENT_TABS.filter((t) => !(t === "Pharmacy" && data.prescription.buyAndBill !== "No"));

  // Re-validates just the field that changed, against the current tab's rules, and clears
  // (or updates) its specific error immediately — the person doesn't have to hit Next
  // again to see a fixed field turn from red back to normal.
  const update = (section, field, value) => {
    setData((prev) => {
      const next = { ...prev, [section]: { ...prev[section], [field]: value } };
      const key = `${section}.${field}`;
      // Editing prescriber.email also has to re-check prescriber.confirmEmail (and vice
      // versa) even if only one of the two currently has a visible error — otherwise
      // fixing Email to finally match an already-typed Confirm Email would leave the
      // stale "does not match" message sitting under Confirm Email forever.
      const pairedKey =
        key === "prescriber.email" ? "prescriber.confirmEmail" : key === "prescriber.confirmEmail" ? "prescriber.email" : null;
      if (errors[key] || (pairedKey && errors[pairedKey])) {
        const freshErrors = validateFields(buildValidationRules(visibleTabs[activeTab], next));
        setErrors((prevErrors) => {
          const copy = { ...prevErrors };
          [key, pairedKey].filter(Boolean).forEach((k) => {
            if (freshErrors[k]) copy[k] = freshErrors[k];
            else delete copy[k];
          });
          return copy;
        });
      }
      return next;
    });
  };

  // Guard against a stale index if Buy and Bill changes after the Pharmacy tab was already
  // active or counted toward navigation.
  useEffect(() => {
    if (activeTab > visibleTabs.length - 1) {
      setActiveTab(visibleTabs.length - 1);
    }
  }, [visibleTabs.length, activeTab]);

  const isLastTab = activeTab === visibleTabs.length - 1;
  const isViewOnly = mode === "view";
  const primaryLabel = mode === "update" ? "Update Case" : mode === "edit" ? "Save Changes" : "Create Enrollment";

  // Reset the scroll gate every time the active tab changes — including landing on
  // Summary itself — so returning to Summary after editing a section always requires
  // scrolling through the (possibly changed) content again before submitting.
  useEffect(() => {
    setSummaryReviewed(false);
  }, [activeTab]);

  // The header + breadcrumbs are position: sticky, so it's the PAGE itself that scrolls
  // (not a bounded inner box) — tracking window scroll is what actually matches that.
  // Also covers the case where the summary is short enough to need no scrolling at all.
  useEffect(() => {
    if (!isLastTab) return;
    const checkScrolledToBottom = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
      const nothingToScroll = document.documentElement.scrollHeight <= window.innerHeight + 4;
      if (scrolledToBottom || nothingToScroll) setSummaryReviewed(true);
    };
    checkScrolledToBottom();
    window.addEventListener("scroll", checkScrolledToBottom);
    window.addEventListener("resize", checkScrolledToBottom);
    return () => {
      window.removeEventListener("scroll", checkScrolledToBottom);
      window.removeEventListener("resize", checkScrolledToBottom);
    };
  }, [isLastTab]);

  // Saves whatever's been filled in so far as a Draft — no validation required, since the
  // whole point is being able to stop partway through and pick back up later.
  const handleSaveDraft = () => {
    onSaveDraft?.(data, enrollmentId);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  // Simulates the real sequence end to end: NDC – Drug Description verification, Program
  // assignment, enrollment package assembly, and the POST to Agadia — all before a Case
  // exists. A Member ID of "FAILTEST" demonstrates the failure path for demo purposes;
  // every other submission succeeds, matching the happy path being the common case.
  const handleCreateEnrollment = () => {
    setSubmissionState("submitting");
    setTimeout(() => {
      const willFail = data.patient.memberId.trim().toUpperCase() === "FAILTEST";
      if (willFail) {
        setSubmissionState("error");
      } else {
        const result = onCreateEnrollment?.(data);
        setCreatedCase(result || null);
        setSubmissionState("success");
      }
    }, 3000);
  };

  // Moving backward (or re-selecting the current tab) is always allowed — no re-validation
  // needed. Moving forward requires the current tab's mandatory fields to be complete and
  // correctly formatted first; if not, navigation is blocked and the offending fields turn
  // red with a specific "X is missing" / format message.
  const goToTab = (targetIdx) => {
    if (isViewOnly || targetIdx <= activeTab) {
      setActiveTab(targetIdx);
      return;
    }
    const rules = buildValidationRules(visibleTabs[activeTab], data);
    const tabErrors = validateFields(rules);
    if (Object.keys(tabErrors).length > 0) {
      setErrors(tabErrors);
      return;
    }
    setErrors({});
    setActiveTab(targetIdx);
  };

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
    switch (visibleTabs[activeTab]) {
      case "Payer & Patient Information":
        return <PayerAndPatientTab data={data} update={update} errors={errors} />;
      case "Prescriber & Servicing Provider":
        return <PrescriberAndServicingProviderTab data={data} update={update} errors={errors} />;
      case "Drug Details":
        return <DrugDetailsTab data={data} update={update} errors={errors} />;
      case "Pharmacy":
        return <PharmacyTab data={data} update={update} errors={errors} />;
      case "Summary":
        return <SummaryTab data={data} onJumpToTab={(tab) => goToTab(visibleTabs.indexOf(tab))} />;
      default:
        return null;
    }
  };

  if (submissionState === "submitting") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          </div>
        </div>
        <Card>
          <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="text-sm font-semibold text-slate-800">Submitting your enrollment</p>
            <p className="max-w-sm text-xs text-slate-500">Verifying drug details and submitting the enrollment package to the payer.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (submissionState === "success") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          </div>
        </div>
        <Card>
          <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={30} />
            </span>
            <p className="text-sm font-semibold text-emerald-700">Enrollment Accepted{createdCase ? ` \u2014 Case ${createdCase.caseId} Created` : ""}</p>
            <p className="max-w-sm text-xs text-slate-500">Please check the Case Status tab for progress.</p>
            <button onClick={onBack} className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Back to Enrollment List
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLastTab && !isViewOnly) {
    return (
      <div className="flex flex-col gap-4">
        {/* Genuinely pinned via position: sticky (not just "first in the markup") — this
            stays put regardless of total page height, which a bounded inner scroll box
            can't guarantee once the page itself is taller than the viewport. */}
        <div className="sticky top-0 z-20 flex flex-col gap-3 bg-[#F8F9FB] pb-3 pt-1" style={{ backgroundColor: "#F8F9FB" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <button onClick={onBack} className="mt-1 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <button
                disabled={!summaryReviewed}
                title={!summaryReviewed ? "Please scroll through the full summary before submitting" : undefined}
                onClick={mode === "create" ? handleCreateEnrollment : undefined}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300"
              >
                {primaryLabel}
              </button>
              {!summaryReviewed && <span className="text-[11px] text-slate-400">Scroll to the bottom of the summary to enable</span>}
            </div>
          </div>
          <Card className="p-0">
            <EnrollmentBreadcrumbs tabs={visibleTabs} activeTab={activeTab} onSelect={goToTab} />
          </Card>
        </div>

        <Card className="p-0">
          {submissionState === "error" && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
              <AlertTriangle size={14} className="shrink-0" /> Case could not be created. Please try again.
            </div>
          )}

          <div className="p-6">{tabContent()}</div>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <button
              onClick={() => goToTab(Math.max(0, activeTab - 1))}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Back
            </button>
            {!summaryReviewed && <span className="text-xs text-amber-600">Keep scrolling to review the rest of the summary</span>}
          </div>
        </Card>
      </div>
    );
  }

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

      {/* Breadcrumbs */}
      <Card className="p-0">
        <EnrollmentBreadcrumbs tabs={visibleTabs} activeTab={activeTab} onSelect={goToTab} />
        <div className="border-t border-slate-100" />

        {Object.keys(errors).length > 0 && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
            <AlertTriangle size={14} className="shrink-0" /> Please fix the highlighted fields before continuing.
          </div>
        )}

        {submissionState === "error" && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
            <AlertTriangle size={14} className="shrink-0" /> Case could not be created. Please try again.
          </div>
        )}

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
                onClick={() => goToTab(Math.max(0, activeTab - 1))}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Back
              </button>
              <>
                {justSaved && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={13} /> Draft saved
                  </span>
                )}
                <button onClick={handleSaveDraft} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Save
                </button>
                <button
                  onClick={() => goToTab(Math.min(visibleTabs.length - 1, activeTab + 1))}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Next
                </button>
              </>
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

function DashboardScreen({ onNewEnrollment, onViewTasks, onOpenCase, caseRows = CASE_TRACKING_ROWS, tasks = TASKS, showEnrollment = true }) {
  const ACTION_HANDLERS = {
    "New Enrollment": onNewEnrollment,
    "View Tasks": onViewTasks,
  };
  const visibleQuickActions = showEnrollment ? QUICK_ACTIONS : QUICK_ACTIONS.filter((a) => a.label !== "New Enrollment");

  const totalCases = caseRows.length;
  const ongoingCases = caseRows.filter((c) => c.status === "Open").length;
  const closedCases = totalCases - ongoingCases;
  const awaitingTasks = tasks.filter((t) => t.status === "Pending").length;

  const kpis = [
    { label: "Total Cases", value: totalCases, sub: "Overall caseload" },
    { label: "Ongoing Cases", value: ongoingCases, sub: "Open" },
    { label: "Awaiting Tasks", value: awaitingTasks, sub: `${tasks.length} total tasks` },
    { label: "Closed Cases", value: closedCases, sub: "Closed" },
  ];

  // The 5 most recently created cases -- CASE_TRACKING_ROWS is already
  // ordered most-recent-first, matching Case Status's own default sort.
  const recentCases = caseRows.slice(0, 5);

  const [caseIdFilter, setCaseIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredCases = recentCases.filter((c) => {
    if (caseIdFilter && !c.caseId.toLowerCase().includes(caseIdFilter.toLowerCase())) return false;
    if (nameFilter && !c.patient.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (statusFilter !== "All Statuses" && getCaseStatusInfo(c).label !== statusFilter) return false;
    return true;
  });

  // Overdue / Due Today / Due This Week / On Track — a real breakdown of what's
  // actually driving the on-time percentage, not just the single number on its own.
  const taskBreakdown = [
    { label: "On Track", value: tasks.length - tasks.filter((t) => t.status === "Pending").length + 1, color: "#5145E5" },
    { label: "Due This Week", value: 2, color: "#8B85F0" },
    { label: "Due Today", value: 0, color: "#F5A524" },
    { label: "Overdue", value: 0, color: "#EF4444" },
  ];
  const caseBreakdown = [
    { label: "Open", value: ongoingCases, color: "#28B473" },
    { label: "Closed", value: closedCases, color: "#94A3B8" },
    { label: "Processed", value: 0, color: "#5145E5" },
  ];

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
        {visibleQuickActions.map((a) => {
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
          <h2 className="text-base font-bold text-slate-900">Recent Cases</h2>
          <span className="text-xs text-slate-400">5 most recently created — matches Case Status</span>
        </div>

        {/* Filtering happens live as you type/select -- no Apply/Clear step */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-3">
          <div className="flex w-36 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
            <Search size={12} className="text-slate-400" />
            <input value={caseIdFilter} onChange={(e) => setCaseIdFilter(e.target.value)} placeholder="Case ID (e.g. 41)" className="w-full text-xs text-slate-600 placeholder:text-slate-400 outline-none" />
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

        <div className="mt-4 flex flex-col gap-2">
          {filteredCases.map((c, idx) => (
            <button
              key={c.caseId}
              onClick={() => onOpenCase?.(c.caseId)}
              className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-sm"
            >
              <PatientAvatar name={c.patient} colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
              <div className="min-w-[170px]">
                <p className="text-sm font-semibold text-slate-800">{c.patient}</p>
                <p className="text-xs text-slate-400">{c.caseId}</p>
              </div>
              <CaseStatusBadge caseItem={c} />
              <div className="flex-1" />
              <UrgencyBadge urgency={c.caseUrgency} />
              <div className="w-28 text-right">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">SLA Due</p>
                <SlaCell date={c.slaDue} overdue={c.overdue} />
              </div>
            </button>
          ))}
          {filteredCases.length === 0 && <p className="px-4 py-6 text-center text-sm text-slate-400">No cases match these filters.</p>}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Task Progress</h3>
            <button className="text-xs font-medium text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="mt-3 flex items-center gap-5">
            <div className="relative flex shrink-0 items-center justify-center">
              <ProgressRing percent={100} color="#5145E5" size={80} stroke={7} />
              <span className="absolute text-sm font-bold text-slate-900">100%</span>
            </div>
            <SegmentBar segments={taskBreakdown} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Case Metrics</h3>
            <button className="text-xs font-medium text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="mt-3 flex items-center gap-5">
            <div className="relative flex shrink-0 items-center justify-center">
              <ProgressRing percent={94} color="#28B473" size={80} stroke={7} />
              <span className="absolute text-sm font-bold text-slate-900">94%</span>
            </div>
            <SegmentBar segments={caseBreakdown} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function EnrollmentsListScreen({ onNew, onEdit, enrollments }) {
  // This list is specifically for enrollments still being worked on — once one is
  // Accepted, it's a Case, and lives in Case Status instead. Showing it here too would
  // just be the same record twice.
  const draftEnrollments = (enrollments || ENROLLMENTS).filter((row) => row.status === "Draft");
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enrollment</h1>
          <p className="mt-1 text-sm text-slate-500">Enrollments still in progress — accepted enrollments become Cases, tracked under Case Status.</p>
        </div>
        <button onClick={onNew} className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus size={15} /> New Enrollment
        </button>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Enrollment ID</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Urgency</th>
              <th className="px-4 py-3 font-semibold">Created At</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {draftEnrollments.map((row, idx) => {
              const isExpanded = expandedId === row.enrollmentId;
              return (
                <React.Fragment key={row.enrollmentId}>
                  <tr className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/60 ${isExpanded ? "bg-indigo-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => setExpandedId(isExpanded ? null : row.enrollmentId)} className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100">
                        <ChevronRight size={14} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <PatientAvatar name={row.patient} colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
                        <span className="font-medium text-slate-800">{row.patient}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{row.enrollmentId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <EnrollmentStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <UrgencyBadge urgency={row.caseUrgency} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{row.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => onEdit(row)} className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                        <Pencil size={13} /> Continue Editing
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <td colSpan={7} className="px-6 py-5">
                        <EnrollmentInlineSummary row={row} onEditFull={() => onEdit(row)} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {draftEnrollments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  No enrollments in progress. Accepted enrollments have moved to Case Status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// The collapsed-in-place recap shown when a row is expanded — every datapoint the
// enrollment form actually captured, across all four sections, at a smaller text size
// so it all fits without needing to scroll a separate screen. There's one "Edit Full
// Enrollment" action rather than per-section edit links, since editing always means
// re-entering the whole form.
function EnrollmentInlineSummary({ row, onEditFull }) {
  // A session-saved draft carries the real data the user actually entered — use that
  // directly rather than falling back to a mocked-from-case reconstruction.
  const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === row.caseId) || { patient: row.patient, caseId: row.caseId, caseUrgency: row.caseUrgency };
  const data = row.formData || mockEnrollmentDataFromCase(linkedCase);
  const payer = data.payer;
  const patient = data.patient;
  const prescriber = data.prescriber;
  const servicing = data.servicingProvider;
  const pharmacy = data.pharmacy;
  const rx = data.prescription;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full Enrollment Summary</p>
        <button onClick={onEditFull} className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
          <Pencil size={12} /> Edit Full Enrollment
        </button>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600">Payer & Patient Information</p>
        <div className="flex flex-wrap gap-2">
          <SummaryRow small label="Payer" value={payer.name} />
          <SummaryRow small label="Urgency" value={payer.urgency} />
          <SummaryRow small label="Patient" value={[patient.firstName, patient.lastName].filter(Boolean).join(" ")} />
          <SummaryRow small label="Date of Birth" value={patient.dob} />
          <SummaryRow small label="Gender" value={patient.gender} />
          <SummaryRow small label="Member ID" value={patient.memberId} />
          <SummaryRow small label="Address" value={[patient.streetAddress, patient.suite, patient.city, patient.state, patient.zip].filter(Boolean).join(", ")} />
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600">Prescriber & Servicing Provider</p>
        <div className="flex flex-col gap-2">
          <div className="rounded-md border border-slate-200 p-2.5">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Prescriber</p>
            <div className="flex flex-wrap gap-2">
              <SummaryRow small label="Name" value={[prescriber.firstName, prescriber.lastName].filter(Boolean).join(" ")} />
              <SummaryRow small label="NPI" value={prescriber.npi} />
              <SummaryRow small label="License" value={[prescriber.licenseState, prescriber.licenseNumber].filter(Boolean).join(" — ")} />
              <SummaryRow small label="Tax ID (TIN)" value={prescriber.taxId} />
              <SummaryRow small label="Phone" value={prescriber.phone ? `${prescriber.phoneType}: ${prescriber.phone}` : ""} />
              <SummaryRow small label="Fax" value={prescriber.fax ? `${prescriber.faxType}: ${prescriber.fax}` : ""} />
              <SummaryRow small label="Email" value={prescriber.email} />
              <SummaryRow small label="Address" value={[prescriber.streetAddress, prescriber.suite, prescriber.city, prescriber.state, prescriber.zip].filter(Boolean).join(", ")} />
            </div>
          </div>
          <div className="rounded-md border border-slate-200 p-2.5">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Servicing Provider</p>
            {servicing.sameAsPrescriber ? (
              <p className="text-xs font-semibold text-slate-700">Same as Prescriber</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <SummaryRow small label="Name" value={[servicing.firstName, servicing.lastName].filter(Boolean).join(" ")} />
                <SummaryRow small label="NPI" value={servicing.npi} />
                <SummaryRow small label="License" value={[servicing.licenseState, servicing.licenseNumber].filter(Boolean).join(" — ")} />
                <SummaryRow small label="Tax ID (TIN)" value={servicing.taxId} />
                <SummaryRow small label="Address" value={[servicing.streetAddress, servicing.suite, servicing.city, servicing.state, servicing.zip].filter(Boolean).join(", ")} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600">Drug Details</p>
        <div className="flex flex-wrap gap-2">
          <SummaryRow small label="Drug" value={rx.drugDescription} />
          <SummaryRow small label="NDC" value={rx.ndc} />
          <SummaryRow small label="HCPCS/CPT Code" value={rx.jCode} />
          <SummaryRow small label="Route" value={rx.route} />
          <SummaryRow small label="Directions" value={rx.directions} />
          <SummaryRow small label="Dosage" value={rx.dosage && rx.unit ? `${rx.dosage} ${rx.unit}` : ""} />
          <SummaryRow small label="Start Date of Service" value={rx.startDateOfService} />
          <SummaryRow small label="Days Supply" value={rx.daysSupply} />
          <SummaryRow small label="Quantity" value={rx.quantity} />
          <SummaryRow small label="Buy and Bill" value={rx.buyAndBill} />
          <SummaryRow small label="Drug Administered Location" value={rx.administeredLocation === "Other" ? rx.administeredLocationOther : rx.administeredLocation} />
          <SummaryRow small label="Allergies" value={rx.allergyQuery} />
          <SummaryRow small label="Diagnosis (ICD-10)" value={rx.icd10Query} />
          <SummaryRow small label="Other Diagnosis" value={rx.otherIcd10Query} />
        </div>
      </div>

      {rx.buyAndBill === "No" && (
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600">Pharmacy</p>
          <div className="flex flex-wrap gap-2">
            <SummaryRow small label="Pharmacy Name" value={pharmacy.businessName} />
            <SummaryRow small label="NPI" value={pharmacy.npi} />
            <SummaryRow small label="NCPDP ID" value={pharmacy.ncpdpId} />
            <SummaryRow small label="Phone" value={pharmacy.phone ? `${pharmacy.phoneType}: ${pharmacy.phone}` : ""} />
            <SummaryRow small label="Fax" value={pharmacy.fax ? `${pharmacy.faxType}: ${pharmacy.fax}` : ""} />
            <SummaryRow small label="Address" value={[pharmacy.streetAddress, pharmacy.suite, pharmacy.city, pharmacy.state, pharmacy.zip].filter(Boolean).join(", ")} />
          </div>
        </div>
      )}
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

// Stable per-task key since TASKS entries don't carry their own id.
function taskKey(t) {
  return `${t.caseId}::${t.type}::${t.title}`;
}

// ---------------------------------------------------------------------------
// Reports — pulls a case-level export for a date range and a chosen set of
// statuses. Runs entirely client-side against whatever cases are currently
// loaded (mergedCaseRows) and downloads a real CSV (Excel opens CSV natively);
// this is a wireframe stand-in for a true server-generated .xlsx export.
// ---------------------------------------------------------------------------

function ReportsScreen({ caseRows }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [allStatusesChecked, setAllStatusesChecked] = useState(true);
  const [selectedPayers, setSelectedPayers] = useState([]);
  const [allPayersChecked, setAllPayersChecked] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null); // { rows, filename } | null

  const allStatuses = STATUS_OPTIONS.filter((s) => s !== "All Statuses");
  // The full master payer list, not just payers that happen to already have a case — a
  // report should be able to ask "were there ever any Anthem cases" even when the answer
  // turns out to be zero.
  const allPayers = PAYER_LIST.map((p) => p.name).sort();

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
    setAllStatusesChecked(false);
    setGenerated(null);
  };

  const toggleAllStatuses = () => {
    setAllStatusesChecked((prev) => !prev);
    setSelectedStatuses([]);
    setGenerated(null);
  };

  const togglePayer = (payer) => {
    setSelectedPayers((prev) => (prev.includes(payer) ? prev.filter((p) => p !== payer) : [...prev, payer]));
    setAllPayersChecked(false);
    setGenerated(null);
  };

  const toggleAllPayers = () => {
    setAllPayersChecked((prev) => !prev);
    setSelectedPayers([]);
    setGenerated(null);
  };

  // Parses the case's own displayed date string ("Jun 28, 2026 2:46 PM") well enough for
  // a same-year range comparison — good enough for a wireframe filter, not a real
  // date-parsing library standing in for whatever the backend would actually query on.
  const parseCaseDate = (row) => {
    const raw = (row.enrollmentDate || "").split(" ").slice(0, 3).join(" ");
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  const matchesFilters = (row) => {
    if (!allStatusesChecked) {
      const statusLabel = getCaseStatusInfo(row).label;
      if (!selectedStatuses.includes(statusLabel)) return false;
    }
    if (!allPayersChecked && !selectedPayers.includes(row.payerName)) return false;
    const caseDate = parseCaseDate(row);
    if (dateFrom && caseDate && caseDate < new Date(dateFrom)) return false;
    if (dateTo && caseDate && caseDate > new Date(`${dateTo}T23:59:59`)) return false;
    return true;
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const matched = caseRows.filter(matchesFilters);
      const payerSlug = allPayersChecked ? "AllPayers" : selectedPayers.map((p) => p.replace(/[^A-Za-z0-9]+/g, "")).join("-") || "NoPayer";
      const filename = `AnvayaRx_PA_Report_${payerSlug}_${dateFrom || "all"}_to_${dateTo || "all"}.csv`;
      setGenerated({ rows: matched, filename });
      setGenerating(false);
    }, 900);
  };

  const handleDownload = () => {
    if (!generated) return;
    const headers = ["Patient", "Case ID", "Member ID", "Payer", "Status", "Stage", "Urgency", "Enrollment Date", "SLA Due"];
    const csv = [
      headers.join(","),
      ...generated.rows.map((r) =>
        [r.patient, r.caseId, r.memberId, r.payerName || "", getCaseStatusInfo(r).label, r.stage, r.caseUrgency, r.enrollmentDate, r.slaDue || ""]
          .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generated.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Pull a case report for a date range, payers, and statuses, in an Excel-compatible format.</p>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-2 gap-5">
          <TextField
            label="From"
            type="date"
            value={dateFrom}
            onChange={(v) => {
              setDateFrom(v);
              setGenerated(null);
            }}
          />
          <TextField
            label="To"
            type="date"
            value={dateTo}
            onChange={(v) => {
              setDateTo(v);
              setGenerated(null);
            }}
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-slate-700">Payers</label>
          <div className="max-h-52 overflow-y-auto rounded-md border border-slate-200 p-3">
            <div className="grid grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
                <input type="checkbox" checked={allPayersChecked} onChange={toggleAllPayers} className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
                All Payers
              </label>
              {allPayers.map((payer) => (
                <label key={payer} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={allPayersChecked || selectedPayers.includes(payer)}
                    onChange={() => togglePayer(payer)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                  />
                  {payer}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-slate-700">Statuses</label>
          <div className="grid grid-cols-3 gap-2.5">
            <label className="flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
              <input type="checkbox" checked={allStatusesChecked} onChange={toggleAllStatuses} className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
              All Statuses
            </label>
            {allStatuses.map((status) => (
              <label key={status} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={allStatusesChecked || selectedStatuses.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                />
                {status}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2.5 border-t border-slate-100 pt-4">
          <button
            onClick={handleGenerate}
            disabled={generating || (!allStatusesChecked && selectedStatuses.length === 0) || (!allPayersChecked && selectedPayers.length === 0)}
            title={
              (!allStatusesChecked && selectedStatuses.length === 0) || (!allPayersChecked && selectedPayers.length === 0)
                ? "Select at least one payer and one status, or check All Payers / All Statuses"
                : undefined
            }
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
            {generating ? "Generating report..." : "Generate Report"}
          </button>
        </div>
      </Card>

      {generated && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">{generated.filename}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {generated.rows.length} case{generated.rows.length === 1 ? "" : "s"} matched your filters.
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={generated.rows.length === 0}
              className="flex items-center gap-1.5 rounded-md border border-indigo-300 px-3.5 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={14} /> Download
            </button>
          </div>
          {generated.rows.length > 0 && (
            <div className="mt-4 max-h-64 overflow-auto rounded-md border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Patient</th>
                    <th className="px-3 py-2 text-left">Case ID</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {generated.rows.slice(0, 20).map((r) => (
                    <tr key={r.caseId} className="border-t border-slate-100">
                      <td className="px-3 py-2">{r.patient}</td>
                      <td className="px-3 py-2">{r.caseId}</td>
                      <td className="px-3 py-2">{getCaseStatusInfo(r).label}</td>
                      <td className="px-3 py-2">{r.enrollmentDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {generated.rows.length > 20 && (
                <p className="border-t border-slate-100 px-3 py-2 text-center text-[11px] text-slate-400">+ {generated.rows.length - 20} more rows in the downloaded file</p>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function TasksScreen({ onOpenCoreDeepLink, acknowledgedTasks, onAcknowledge, tasks = TASKS }) {
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
            {tasks.map((t, idx) => {
              const linkedCase = CASE_TRACKING_ROWS.find((c) => c.caseId === t.caseId);
              const isPA = t.type === "pa_questions" || t.type === "pa_status" || t.type === "pa_questions_additional";
              const key = taskKey(t);
              const isAcknowledged = acknowledgedTasks.has(key);
              const displayStatus = t.status === "Pending" && isAcknowledged ? "Acknowledged" : t.status;
              return (
                <tr key={key} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-800">{t.title}</td>
                  <td className="px-4 py-3 text-slate-500">{t.type}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">{t.caseId}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{linkedCase ? linkedCase.patient : t.patient}</td>
                  <td className="px-4 py-3">
                    <UrgencyBadge urgency={t.caseUrgency} />
                  </td>
                  <td className="px-4 py-3">
                    <TaskStatusBadge status={displayStatus} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{t.dueDate}</td>
                  <td className="px-4 py-3 text-slate-500">{t.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => !isAcknowledged && onAcknowledge(key)}
                        disabled={isAcknowledged}
                        title={isAcknowledged ? "Acknowledged" : "Acknowledge — clears the notification"}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${isAcknowledged ? "text-emerald-500" : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"}`}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => isPA && onOpenCoreDeepLink(t.caseId, t.type === "pa_status" ? "status" : "questions")}
                        disabled={!isPA}
                        title={isPA ? "Take action on this case" : "Not wired up in this demo"}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${
                          isPA ? "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" : "cursor-default text-slate-200"
                        }`}
                      >
                        <PlayCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>1–{tasks.length} of {tasks.length} tasks</span>
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

const DATA_INTAKE_TABS = ENROLLMENT_TABS.slice(0, ENROLLMENT_TABS.length - 1); // drop Summary

function DataIntakeStage({ caseItem }) {
  const [tabIdx, setTabIdx] = useState(0);
  const data = mockEnrollmentDataFromCase(caseItem);
  const noop = () => {};

  const renderTab = () => {
    switch (DATA_INTAKE_TABS[tabIdx]) {
      case "Payer & Patient Information":
        return <PayerAndPatientTab data={data} update={noop} />;
      case "Prescriber & Servicing Provider":
        return <PrescriberAndServicingProviderTab data={data} update={noop} />;
      case "Drug Details":
        return <DrugDetailsTab data={data} update={noop} />;
      case "Pharmacy":
        return <PharmacyTab data={data} update={noop} />;
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
        {pending ? "Awaiting Questionnaire \u2014 Eligibility Check & Benefit Investigation in progress" : passed ? "Eligibility check successful - Patient has Valid Insurance" : `Coverage Determination Failed \u2014 ${caseItem.eligibilityFailureReason}`}
      </span>
      <p className="max-w-sm text-xs text-slate-500">
        {pending
          ? "Agadia's Eligibility Check and Benefit Investigation are still running for this case. This status updates automatically once a determination is returned."
          : passed
          ? "This case is cleared to move forward to Benefits Investigation."
          : "This case cannot proceed until the Coverage Determination issue is resolved — see Case Status for details."}
      </p>
    </div>
  );
}

function BenefitInvestigationStage({ caseItem }) {
  // Benefit Investigation can't have started at all if Coverage Determination itself hasn't
  // cleared yet — showing "PA not required" here for a Coverage-Determination-failed case would
  // wrongly imply this step ran and reached a determination, when really nothing past
  // Coverage Determination has happened yet.
  if (caseItem.eligibilityStatus !== "success") {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900">Benefit Investigation</h3>
        <EmptyPlaceholder text="Benefit Investigation hasn't started — this case is still at the Coverage Determination stage and needs to clear there first." />
      </div>
    );
  }
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
        {!required && <p className="max-w-sm text-xs text-slate-500">Coverage Determination passed and Benefit Investigation determined this drug does not require Prior Authorization for this plan.</p>}
      </div>
    </div>
  );
}

// ---- Stage 4: Prior Authorization — Clinical Questions + PA Status live here together ----

function ClinicalQuestionsTab({ questions, savedDraft, onSaveDraft, onSubmitAnswers, caseItem, onContactPrescriber }) {
  const [qIndex, setQIndex] = useState(savedDraft?.qIndex || 0);
  const [answers, setAnswers] = useState(savedDraft?.answers || Array(questions.length).fill(""));
  const [uploads, setUploads] = useState(savedDraft?.uploads || Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const fileInputRef = useRef(null);

  const isLast = qIndex === questions.length - 1;
  const currentQuestion = questions[qIndex];
  const canProceed = currentQuestion.optional || answers[qIndex].trim().length > 0;
  const answeredCount = answers.filter((a) => a.trim().length > 0).length;
  // Some payers require the questionnaire to be submitted by the prescriber directly —
  // the Partner can still fill in what they know (to hand the prescriber a head start),
  // but Submit Answers itself is never available to them for this payer.
  const prescriberOnlySubmission = Boolean(caseItem?.requiresPrescriberSubmission);

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
    onSaveDraft?.({ qIndex, answers, uploads });
    setDraftSaved(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-emerald-50 px-6 py-10 text-center">
        <CheckCircle2 className="text-emerald-600" size={32} />
        <p className="text-sm font-semibold text-emerald-700">Answers submitted</p>
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
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            Question {qIndex + 1} of {questions.length}
          </span>
          {onContactPrescriber && (
            <button
              onClick={() => setShowContactModal(true)}
              title="Questions will be sent to the prescriber for submission/review via the email and text on file."
              className="flex items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
            >
              <Send size={13} /> Contact Prescriber
            </button>
          )}
        </div>
      </div>

      {prescriberOnlySubmission && (
        <div className="flex items-start gap-2 rounded-md border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-medium text-violet-700">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          This payer requires the prescriber to submit these answers directly. You can fill in what you know below to give the
          prescriber a head start, but Submit Answers stays unavailable to you — use Contact Prescriber to send it to them.
        </div>
      )}

      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">Question {qIndex + 1}</p>
        <p className="mb-3 text-sm font-medium text-slate-800">{questions[qIndex].text}</p>
        {currentQuestion.type === "yesno" && (
          <div className="flex gap-2.5">
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswer(opt)}
                className={`flex-1 rounded-md border px-4 py-2.5 text-sm font-semibold transition ${
                  answers[qIndex] === opt ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        {currentQuestion.type === "multiplechoice" && (
          <div className="flex flex-col gap-2">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswer(opt)}
                className={`flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-left text-sm font-medium transition ${
                  answers[qIndex] === opt ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${answers[qIndex] === opt ? "border-indigo-600" : "border-slate-300"}`}>
                  {answers[qIndex] === opt && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}
        {currentQuestion.type === "number" && (
          <input
            type="number"
            value={answers[qIndex]}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter a number"
            className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
          />
        )}
        {currentQuestion.type === "text" && (
          <input
            value={answers[qIndex]}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={currentQuestion.optional ? "Optional — type your answer here" : "Type your answer here"}
            className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
          />
        )}
        <p className="mt-1.5 text-xs text-slate-400">Your answer determines which question is asked next.</p>
      </div>

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
              disabled={!canProceed || prescriberOnlySubmission}
              title={prescriberOnlySubmission ? "You are not authorized to submit these answers on behalf of the prescriber — please contact the prescriber to submit the information." : undefined}
              onClick={() => {
                setSubmitted(true);
                onSubmitAnswers?.(answers);
              }}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300"
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

      {showContactModal && (
        <ContactPrescriberModal
          caseItem={caseItem}
          answeredCount={answeredCount}
          totalCount={questions.length}
          onCancel={() => setShowContactModal(false)}
          onConfirm={() => {
            setShowContactModal(false);
            onContactPrescriber?.(answers);
          }}
        />
      )}
    </div>
  );
}

// A same-page confirmation, not a full navigation — the Partner should never have to
// wonder who exactly it's going to or lose the question they were on to check.
function ContactPrescriberModal({ caseItem, answeredCount, totalCount, onCancel, onConfirm }) {
  const prescriberName = caseItem?.prescriberName || "the prescriber";
  const prescriberEmail = caseItem?.prescriberEmail || "prescriber@example.com";
  const prescriberPhone = caseItem?.prescriberPhone || "(555) 000-0000";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Send size={18} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Contact Prescriber?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Questions will be sent to <span className="font-semibold text-slate-700">{prescriberName}</span> for submission/review via the email and text on file — {prescriberEmail} and {prescriberPhone}.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-md bg-slate-50 px-3.5 py-3 text-xs text-slate-600">
          <p>
            {answeredCount} of {totalCount} question{totalCount === 1 ? "" : "s"} answered so far. The prescriber will see the full
            questionnaire — whatever's already answered, plus anything still outstanding — and can edit any answer before submitting.
          </p>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button onClick={onCancel} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
            Send to Prescriber
          </button>
        </div>
      </div>
    </div>
  );
}

function PALetterOverlay({ status, caseItem, onClose }) {
  // Every value below comes from the specific Case, not a fixed template - the letter
  // reflects whichever patient, prescriber, drug, and quantity were actually entered.
  const patientName = caseItem?.patient || "the patient";
  const prescriberName = caseItem?.prescriberName || "the prescriber";
  const drugName = caseItem?.drugName || "the requested medication";
  const memberId = caseItem?.memberId && caseItem.memberId !== "\u2014" ? caseItem.memberId : "on file";
  const decisionDate = caseItem?.dateClosed || caseItem?.reviewSubmittedDate || "the date of this notice";
  const authStart = caseItem?.authStartDate || decisionDate;
  const authEnd = caseItem?.authEndDate || decisionDate;
  const quantityPhrase = caseItem?.approvedQuantity && caseItem?.approvedDaysSupply ? ` (${caseItem.approvedQuantity}, ${caseItem.approvedDaysSupply})` : "";

  const letters = {
    Approved: (
      <>
        <p>{decisionDate}</p>
        <p>{patientName}<br />Address on file</p>
        <p><strong>RE:</strong> Approval for {drugName}</p>
        <p>Dear {prescriberSalutation(prescriberName)}:</p>
        <p>Health Plan Inc. has approved {drugName}{quantityPhrase} from {authStart} to {authEnd} as requested by {prescriberName}.</p>
        <p>Health Plan Inc. will pay for this requested medication. You may be charged a copay for this medication.</p>
        <p>Please call us if you have any questions about your benefits. Our Member Relations department is always ready to help you. You can call 24 hours a day, 7 days a week. Please call 973-540-8400.</p>
        <p>Sincerely,</p>
        <p>Health Plan Inc. Pharmacy Department</p>
        <p className="mt-6 text-xs text-slate-500">cc: {prescriberName}<br />Address on file</p>
      </>
    ),
    Denied: (
      <>
        <p>{decisionDate}</p>
        <p><strong>RE:</strong> {patientName}</p>
        <p>{patientName}<br />Address on file</p>
        <p>Dear {prescriberSalutation(prescriberName)}</p>
        <p>Health Plan has reviewed the request to approve the prescription for {drugName} submitted by you on behalf of {patientName}, Health Plan member {memberId}. After Physician review, the request is denied completely{caseItem?.denialReason ? ` \u2014 ${caseItem.denialReason}` : ""}.</p>
        <p>This decision will take effect on {decisionDate}.</p>
        <p className="font-semibold">To continue getting services</p>
        <p>If you have been receiving the medicine that is being reduced, changed, or denied and you file a complaint, grievance, or request for a fair hearing that is postmarked or hand-delivered within 10 days of the date on this notice, the prescription will continue until a decision is made.</p>
        <p className="font-semibold">IF YOU DO NOT AGREE WITH THIS DECISION, YOU MAY DO ONE OR ALL OF THE FOLLOWING:</p>
        <p>1) Request a copy of the medical necessity criteria the decision was based on by writing to the Health Plan &amp; Grievance Department, 9 Campus Drive, 2nd Floor East, Parsippany, NJ 07054.</p>
        <p>2) File a complaint or grievance with Health Plan within 45 days of this notice by calling (973) 540-8400.</p>
        <p>3) Request a fair hearing from the Department of Public Welfare, in writing, postmarked within 30 days of this notice.</p>
        <p>Sincerely,</p>
        <p>Health Plan</p>
        <p className="mt-6 text-xs text-slate-500">cc: {prescriberName}<br />Address on file</p>
      </>
    ),
    "Partially Approved": (
      <>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">ABCCOMM14976ABC Commercial Client — TRAINING TEAM DO NOT EDIT</p>
        <p>{decisionDate}</p>
        <p>{patientName}<br />Address on file</p>
        <p>Member ID: {memberId}</p>
        <p><strong>RE:</strong> Approval for {drugName}</p>
        <p>Dear {patientName}:</p>
        <p>Health Plan, Inc. has partially approved {drugName}{quantityPhrase} from {authStart} to {authEnd} as requested by {prescriberName}.</p>
        <p>Your request was partially denied for the following reasons: {caseItem?.partialReason || "the quantity requested exceeds the plan\u2019s standard authorization limit"}.</p>
        <p>Please call us if you have any questions about your benefits. Our Member Relations department is always ready to help you. You can call 24 hours a day, 7 days a week. Please call 973-540-8400.</p>
        <p>Sincerely,</p>
        <p>Health Plan Pharmacy Department</p>
        <p className="mt-6 text-xs text-slate-500">cc: {prescriberName}<br />Address on file</p>
      </>
    ),
    // No "Payer Needs More Information" entry here on purpose — per Agadia, NMI never
    // gets a determination letter of its own. It's either a second question set (handled
    // entirely within the Clinical Questions tab, not this letter) or direct outreach to
    // the prescriber that AnvayaRx isn't part of (see PayerOutreachLogPanel). This overlay
    // only ever opens for an actual decided outcome.
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
          {letters[status]}
        </div>
      </div>
    </div>
  );
}

function PAStatusTab({ caseItem }) {
  const [showLetter, setShowLetter] = useState(false);
  const status = caseItem.paStatus;
  // "Payer Needs More Information" is a transient bucket, not a decided/lettered outcome —
  // see PriorAuthorizationStage for the full explanation. Treated here the same as any
  // other not-yet-decided status: the simple centered-pill view below, no letter link.
  const isDecided = Boolean(status) && status !== "Payer Needs More Information";

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
    const styleKey =
      label === "Awaiting Questionnaire"
        ? "Awaiting Questionnaire"
        : label === "Awaiting Response"
        ? "Awaiting Response"
        : label === "Awaiting Prescriber Input"
        ? "Awaiting Prescriber Input"
        : label === "Payer Needs More Information"
        ? "Payer Needs More Information"
        : "Under Payer Review";
    const style = PA_STATUS_STYLES[styleKey] || PA_STATUS_STYLES["Under Payer Review"];
    const Icon = style.icon;
    return (
      <>
        {drugInfoHeader}
        {label === "Payer Needs More Information" && caseItem.nmiChannel && caseItem.nmiChannel !== "question_set" ? (
          <PayerOutreachPreviewPanel caseItem={caseItem} />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-lg bg-slate-50 px-6 py-14 text-center">
            <span className={`flex h-14 w-14 items-center justify-center rounded-full border ${style.pill}`}>
              <Icon size={26} />
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${style.pill}`}>{label}</span>
          </div>
        )}
      </>
    );
  }

  const style = PA_STATUS_STYLES[status] || PA_STATUS_STYLES["Under Payer Review"];
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
      {showLetter && <PALetterOverlay status={status} caseItem={caseItem} onClose={() => setShowLetter(false)} />}
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
        These clinical questions were already answered and submitted. This case's status is <span className="font-semibold">{status}</span> — responses are read-only.
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

// Shown in place of the editable questionnaire once Contact Prescriber has been used and
// the prescriber hasn't submitted from their own secure-link view yet. Not the same as the
// fully-locked read-only view above — nothing has reached the Payer at this point.
// Covers the other two ways a Payer can act on "Payer Needs More Information" besides
// sending a second question set back through AnvayaRx: emailing the prescriber directly,
// or reaching them by phone/fax. Per Agadia, the actual content of that exchange is
// invisible to us either way — but the fact that it happened, why, and when is logged
// automatically on their side and is what this panel surfaces, so AnvayaRx (and the
// Partner) are still "in the loop" on the case without us fabricating visibility into a
// conversation we were never part of.
// Shown to Enrollment User in place of the interactive questionnaire — they can see that a
// case is awaiting a response, just not act on it themselves.
function ReadOnlyCaseNotice() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-6 py-8 text-center">
      <Lock size={20} className="text-slate-400" />
      <p className="text-sm font-semibold text-slate-700">View-only access</p>
      <p className="max-w-sm text-xs text-slate-500">
        Your role can see this case's status but can't answer questions or take action on it — that needs a Case Action User or All Portal User/Admin.
      </p>
    </div>
  );
}

// One consolidated panel — status, explanation, and the actual content preview all in a
// single block, rather than a status pill plus a separate banner repeating the same
// thing. Per Agadia's PAHub, whichever way the Payer chose to reach the prescriber
// (an in-app question set, email, fax, or phone call) is the SAME underlying ask —
// PA_QUESTIONS_ADDITIONAL — just delivered a different way, and PAHub logs what was
// actually sent/said either way, so AnvayaRx can show it here instead of only a log entry.
function PayerOutreachPreviewPanel({ caseItem }) {
  const channel = caseItem.nmiChannel;
  const CHANNEL_META = {
    email: { verb: "emailed", Icon: Mail },
    fax: { verb: "faxed", Icon: FileText },
    call: { verb: "called", Icon: MessageSquare },
  };
  const meta = CHANNEL_META[channel] || CHANNEL_META.email;
  const prescriberName = caseItem.prescriberName || "the prescriber";

  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
      <div className="flex items-start gap-2 text-purple-700">
        <meta.Icon size={16} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Payer Needs More Information</p>
          <p className="mt-0.5 text-xs leading-snug text-purple-600">
            The Payer {meta.verb} {prescriberName} on {caseItem.nmiRequestedAt || "an unspecified date"} regarding{" "}
            {caseItem.moreInfoRequested || "additional information on this request"}. Shown below exactly as logged in Agadia's PAHub — the
            case will update here as soon as the Payer reaches a decision.
          </p>
        </div>
      </div>
      <div className="mt-3.5">
        {channel === "email" && <EmailOutreachPreview caseItem={caseItem} />}
        {channel === "fax" && <FaxOutreachPreview caseItem={caseItem} />}
        {channel === "call" && <CallOutreachPreview caseItem={caseItem} />}
      </div>
    </div>
  );
}

function EmailOutreachPreview({ caseItem }) {
  const prescriberName = caseItem.prescriberName || "the prescriber";
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="space-y-0.5 border-b border-slate-100 px-4 py-2.5 text-xs text-slate-500">
        <div>To: {caseItem.prescriberEmail || "prescriber@example.com"}</div>
        <div>Subject: Additional Information Needed — {caseItem.patient}</div>
      </div>
      <div className="px-4 py-4 text-sm text-slate-700">
        <p>Dear {prescriberSalutation(prescriberName)},</p>
        <p className="mt-2.5">Before we can complete our review of this request, please provide the following:</p>
        <ul className="mt-2.5 list-disc space-y-1.5 pl-5">
          {PA_QUESTIONS_ADDITIONAL.map((q) => (
            <li key={q.id}>{q.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FaxOutreachPreview({ caseItem }) {
  return (
    <div className="rounded-lg border border-slate-300 bg-white p-4 font-mono text-xs text-slate-700">
      <div className="border-b border-dashed border-slate-300 pb-2 text-center font-bold uppercase tracking-widest text-slate-500">Fax Transmission</div>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        <div>To: {prescriberSalutation(caseItem.prescriberName)}</div>
        <div>Fax: {caseItem.prescriberFax || "on file"}</div>
        <div>Date: {caseItem.nmiRequestedAt || "—"}</div>
        <div>Pages: 1</div>
      </div>
      <div className="mt-3 border-t border-dashed border-slate-300 pt-2.5">
        <p>RE: Additional Information Needed — {caseItem.patient}</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          {PA_QUESTIONS_ADDITIONAL.map((q) => (
            <li key={q.id}>{q.text}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function CallOutreachPreview({ caseItem }) {
  const prescriberName = caseItem.prescriberName || "the prescriber";
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <MessageSquare size={14} className="text-purple-500" /> Call Log — {caseItem.nmiRequestedAt || "—"}
      </div>
      <p className="mt-1 text-xs text-slate-500">Payer's representative called {prescriberSalutation(prescriberName)}'s office to discuss the following:</p>
      <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
        {PA_QUESTIONS_ADDITIONAL.map((q) => (
          <li key={q.id}>{q.text}</li>
        ))}
      </ul>
    </div>
  );
}

function AwaitingPrescriberInputPanel({ questions, caseItem, onOpenPrescriberDemo, sentAnswers }) {
  const [showPreview, setShowPreview] = useState(false);
  const answers = sentAnswers || Array(questions.length).fill("");
  const answeredCount = answers.filter((a) => (a || "").trim().length > 0).length;
  const prescriberName = caseItem.prescriberName || "The prescriber";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2 rounded-md border border-violet-200 bg-violet-50 px-3.5 py-3 text-xs text-violet-700">
        <Send size={14} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">Sent to prescriber — Awaiting Prescriber Input</p>
          <p className="mt-0.5 text-violet-600">
            {prescriberName} was emailed and texted a secure link to review and submit this questionnaire. {answeredCount} of{" "}
            {questions.length} answered so far — the prescriber can edit any of these before submitting.
          </p>
        </div>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-md border border-slate-200 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Question {idx + 1}</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{q.text}</p>
          <p className={`mt-2 rounded-md px-3 py-2 text-sm ${answers[idx] ? "bg-slate-50 text-slate-600" : "bg-amber-50 italic text-amber-600"}`}>
            {answers[idx] || "Not yet answered — outstanding for the prescriber"}
          </p>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Mail size={13} /> Preview email & text sent to prescriber
        </button>
        {onOpenPrescriberDemo && (
          <button
            onClick={onOpenPrescriberDemo}
            className="flex items-center gap-1.5 rounded-md border border-violet-300 bg-white px-3.5 py-2 text-xs font-medium text-violet-700 hover:bg-violet-50"
          >
            <ShieldCheck size={13} /> Simulate: open secure link as prescriber (demo)
          </button>
        )}
      </div>

      {showPreview && <PrescriberNotificationPreviewModal caseItem={caseItem} onClose={() => setShowPreview(false)} />}
    </div>
  );
}

// Mockup of what actually lands in the prescriber's inbox/phone — not functional (the
// "Review & Submit" button here doesn't navigate anywhere), just what gets sent. The
// reminder cadence shown at the bottom follows the case's own Urgent/Not Urgent flag.
function PrescriberNotificationPreviewModal({ caseItem, onClose }) {
  const [tab, setTab] = useState("email");
  const prescriberName = caseItem.prescriberName || "the prescriber";
  const patientName = caseItem.patient || "the patient";
  const drugLabel = caseItem.programme || caseItem.drugName || "their prescribed medication";
  const isUrgent = caseItem.caseUrgency === "Urgent";
  const cadence = isUrgent ? "3, 6, 9, and 12 hours" : "12, 24, 36, and 48 hours";
  // Both channels open with the same "Hi {name}," greeting — kept deliberately identical
  // so the two previews read as one consistent notification, not two different messages.
  const textBody = `Hi ${prescriberSalutation(prescriberName)}, your patient ${patientName} needs assistance completing a Prior Authorization for ${drugLabel}. Review & submit securely: anvayarx.com/s/8f2k1 — Msg & data rates may apply. Reply STOP to opt out.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-bold text-slate-900">What the prescriber receives</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-4 border-b border-slate-100 px-5">
          <button
            onClick={() => setTab("email")}
            className={`flex items-center gap-1.5 border-b-2 py-2.5 text-xs font-semibold ${tab === "email" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}
          >
            <Mail size={13} /> Email
          </button>
          <button
            onClick={() => setTab("text")}
            className={`flex items-center gap-1.5 border-b-2 py-2.5 text-xs font-semibold ${tab === "text" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}
          >
            <MessageSquare size={13} /> Text
          </button>
        </div>
        <div className="flex flex-col items-center p-5">
          {tab === "email" ? (
            <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-2.5 text-xs text-slate-400">To: {caseItem.prescriberEmail || "prescriber@example.com"}</div>
              <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                <p className="text-base font-bold text-slate-800">Hi {prescriberSalutation(prescriberName)},</p>
                <p className="max-w-sm text-sm text-slate-600">
                  Your patient, {patientName}, needs your assistance completing a Prior Authorization for {drugLabel}. Please click the
                  secure link below to review and submit the outstanding information.
                </p>
                <button className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Review & Submit</button>
              </div>
            </div>
          ) : (
            // A phone-frame mockup rather than a bare text bubble — closer to what the
            // prescriber's office actually sees, and makes clear this arrives as a real SMS.
            <div className="w-[260px] overflow-hidden rounded-[28px] border-4 border-slate-800 bg-black shadow-lg">
              <div className="flex items-center justify-between bg-black px-4 pb-1 pt-2 text-[10px] font-semibold text-white">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="flex items-end gap-[1.5px]">
                    <span className="h-[3px] w-[2px] bg-white" />
                    <span className="h-[5px] w-[2px] bg-white" />
                    <span className="h-[7px] w-[2px] bg-white" />
                    <span className="h-[9px] w-[2px] bg-white" />
                  </div>
                  <span className="h-[8px] w-[14px] rounded-[2px] border border-white" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 bg-black px-4 pb-2 pt-1">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 text-xs font-bold text-white">Rx</span>
                <span className="text-[10px] font-medium text-slate-300">AnvayaRx</span>
              </div>
              <div className="min-h-[200px] bg-white px-3 pb-4 pt-3">
                <p className="mb-1 text-center text-[9px] font-medium text-slate-400">Today 9:41 AM</p>
                <div className="flex flex-col gap-1">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-[11px] leading-snug text-slate-800">{textBody}</div>
                  <span className="ml-1 text-[9px] text-slate-400">Delivered</span>
                </div>
              </div>
            </div>
          )}
          <p className="mt-4 flex items-start gap-1.5 text-[11px] text-slate-400">
            <Clock size={12} className="mt-0.5 shrink-0" />
            If left unanswered, reminders go out by email and text at {cadence} after this message ({isUrgent ? "Urgent" : "Not Urgent"} case).
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prescriber-side secure-link experience — what the prescriber (or their staff) sees
// after opening the link from the email/text above. Kept in this same file per product
// direction, rather than a separate wireframe, since it's really the other half of the
// same Contact Prescriber flow and the two need to stay in lockstep as this evolves.
// Demo-only entry point: reached via "Simulate: open secure link as prescriber" above.
// ---------------------------------------------------------------------------

function PrescriberVerifyScreen({ caseItem, onVerified }) {
  const [memberId, setMemberId] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const idMatches = memberId.trim().toUpperCase() === (caseItem.memberId || "").trim().toUpperCase();
    // DOB isn't part of the case-tracking row's own data today, so any non-empty value is
    // accepted here for demo purposes — a real integration checks it against the patient
    // record the same way Member ID is checked above.
    if (!idMatches || !dob) {
      setError("The information provided doesn't match our records. Please try again.");
      return;
    }
    setError("");
    onVerified();
  };

  return (
    <div className="flex min-h-[calc(100vh-36px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Lock size={18} />
          </span>
          <h1 className="text-base font-bold text-slate-900">Confirm Patient Details</h1>
          <p className="text-xs text-slate-500">
            To protect patient privacy, please confirm the following before viewing this Prior Authorization request for{" "}
            {caseItem.patient}.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <TextField label="Member ID" required value={memberId} onChange={setMemberId} placeholder="As it appears on the insurance card" />
          <TextField label="Date of Birth" required type="date" value={dob} onChange={setDob} />
        </div>
        {error && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600">
            <AlertTriangle size={12} /> {error}
          </p>
        )}
        <button
          onClick={handleContinue}
          disabled={!memberId.trim() || !dob}
          className="mt-5 w-full rounded-md bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Stacked, one-below-another layout (not one question per page) — the prescriber's office
// needs to scan every question at once before submitting, and this needs to work as well on
// a phone (from the text link) as on a desktop (from the email link).
function PrescriberQuestionnaireScreen({ caseItem, questions, initialAnswers, onSubmit, onExit }) {
  const seededAnswers = initialAnswers && initialAnswers.length === questions.length ? initialAnswers : Array(questions.length).fill("");
  const [answers, setAnswers] = useState(seededAnswers);
  // Progressive reveal — start with whatever was already answered by the office plus the
  // next unanswered one, and open up one more each time the newest visible question gets
  // answered. Everything revealed so far stays on screen (so the prescriber can review
  // earlier answers while filling in new ones) — this is deliberately NOT the Partner's
  // one-question-at-a-time carousel, where the previous question disappears.
  const initialVisible = Math.min(questions.length, seededAnswers.filter((a) => (a || "").trim().length > 0).length + 1);
  const [visibleCount, setVisibleCount] = useState(Math.max(1, initialVisible));
  const [submitted, setSubmitted] = useState(false);
  const [declared, setDeclared] = useState(false);
  // Mirrors the Partner-side Clinical Questions upload — available at every question, not
  // just the last one, since supporting documentation (chart notes, lab results) can be
  // relevant to any single question rather than the questionnaire as a whole. One shared
  // hidden file input is reused for every question; activeUploadIdx tracks which question
  // triggered the picker so the resulting file name lands against the right one.
  const [uploads, setUploads] = useState({});
  const [activeUploadIdx, setActiveUploadIdx] = useState(null);
  const fileInputRef = useRef(null);
  const handleChooseFile = (idx) => {
    setActiveUploadIdx(idx);
    fileInputRef.current?.click();
  };
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && activeUploadIdx !== null) {
      setUploads((prev) => ({ ...prev, [activeUploadIdx]: file.name }));
    }
    e.target.value = "";
  };
  const allAnswered = questions.every((q, i) => q.optional || (answers[i] || "").trim().length > 0);
  const prescriberName = caseItem.prescriberName || "the prescriber";

  const setAnswer = (idx, val) => {
    const next = [...answers];
    next[idx] = val;
    setAnswers(next);
    if (idx === visibleCount - 1 && val.trim().length > 0) {
      setVisibleCount((v) => Math.min(questions.length, v + 1));
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-36px)] flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <CheckCircle2 className="text-emerald-600" size={36} />
        <p className="text-base font-semibold text-emerald-700">Submitted — thank you</p>
        <p className="max-w-sm text-sm text-slate-500">The payer will review these answers next. You can close this window now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-36px)] bg-slate-50 pb-24">
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">Rx</span>
          <div>
            <p className="text-sm font-bold text-slate-900">Prior Authorization Questions</p>
            <p className="text-xs text-slate-500">
              {caseItem.patient} — {caseItem.programme || caseItem.drugName || "prescribed medication"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6 sm:px-8">
        <p className="text-xs text-slate-500">
          Please review and complete every question below, then submit. Anything already answered by the office can still be edited.
        </p>
        {questions.slice(0, visibleCount).map((q, idx) => (
          <div key={q.id} className="rounded-lg border border-slate-200 bg-white px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Question {idx + 1}
              {q.optional ? " (optional)" : ""}
            </p>
            <p className="mb-3 mt-1 text-sm font-medium text-slate-800">{q.text}</p>
            {q.type === "yesno" && (
              <div className="flex gap-2.5">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(idx, opt)}
                    className={`flex-1 rounded-md border px-4 py-2.5 text-sm font-semibold transition ${
                      answers[idx] === opt ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {q.type === "multiplechoice" && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(idx, opt)}
                    className={`flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-left text-sm font-medium transition ${
                      answers[idx] === opt ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${answers[idx] === opt ? "border-indigo-600" : "border-slate-300"}`}>
                      {answers[idx] === opt && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {q.type === "number" && (
              <input
                type="number"
                value={answers[idx]}
                onChange={(e) => setAnswer(idx, e.target.value)}
                placeholder="Enter a number"
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              />
            )}
            {q.type === "text" && (
              <input
                value={answers[idx]}
                onChange={(e) => setAnswer(idx, e.target.value)}
                placeholder={q.optional ? "Optional — type your answer here" : "Type your answer here"}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              />
            )}
            <div className="mt-3 rounded-lg bg-slate-50 px-3.5 py-3">
              <p className="mb-2 text-xs font-medium text-slate-600">Upload supporting document (optional)</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleChooseFile(idx)}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <UploadCloud size={13} /> Choose file
                </button>
                <span className="text-xs text-slate-400">{uploads[idx] || "No file selected"}</span>
              </div>
            </div>
          </div>
        ))}
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />

        {/* Only shown once every question is visible — the declaration is about the full
            set of answers being submitted, so it doesn't make sense to show it while
            questions are still being progressively revealed. */}
        {visibleCount >= questions.length && (
          <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={declared}
              onChange={(e) => setDeclared(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
            />
            <span>
              I, prescriber <strong>{prescriberName}</strong>, hereby declare that I am submitting these answers.
            </span>
          </label>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button onClick={onExit} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Close
          </button>
          <button
            disabled={!allAnswered || !declared}
            title={!allAnswered ? "Please answer every question before submitting." : !declared ? "Please confirm the declaration above before submitting." : undefined}
            onClick={() => {
              setSubmitted(true);
              onSubmit(answers);
            }}
            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Submit Answers
          </button>
        </div>
      </div>
    </div>
  );
}

function PrescriberSecureLinkFlow({ caseItem, questions, initialAnswers, onSubmit, onExit }) {
  const [verified, setVerified] = useState(false);
  return (
    <div className="min-h-screen">
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between bg-slate-900 px-4 py-2 text-xs text-white">
        <span className="flex items-center gap-1.5 font-semibold">
          <ShieldCheck size={13} /> Demo — this is the view the prescriber (or their staff) sees after opening the secure link
        </span>
        <button onClick={onExit} className="rounded border border-white/30 px-2 py-1 hover:bg-white/10">
          ‹ Back to Partner view
        </button>
      </div>
      <div className="pt-9">
        {!verified ? (
          <PrescriberVerifyScreen caseItem={caseItem} onVerified={() => setVerified(true)} />
        ) : (
          <PrescriberQuestionnaireScreen caseItem={caseItem} questions={questions} initialAnswers={initialAnswers} onSubmit={onSubmit} onExit={onExit} />
        )}
      </div>
    </div>
  );
}

function PriorAuthorizationStage({ caseItem, initialSubTab, savedDraft, onSaveDraft, onSubmitAnswers, onContactPrescriber, onOpenPrescriberDemo, onSubmitAdditionalAnswers, onContactPrescriberAdditional, readOnly }) {
  const [subTab, setSubTab] = useState(initialSubTab || "questions");
  // "Payer Needs More Information" is NOT a decided/lettered outcome — only Approved,
  // Denied, and Partially Approved get a determination letter. NMI instead means the
  // Payer is asking for more before they can decide, delivered one of four ways per
  // Agadia's PAHub — an in-app question set (interactive, lives on this tab), or email,
  // fax, or a phone call (all three previewed read-only on the PA Status tab instead,
  // since PAHub logs exactly what was sent/said either way — see PayerOutreachPreviewPanel).
  const isNmi = caseItem.paStatus === "Payer Needs More Information";
  const isDecided = Boolean(caseItem.paStatus) && !isNmi;
  // Once answers are submitted, they're locked in — whether or not the Payer has
  // reached a decision yet. Showing the live editing flow here would let someone
  // re-answer questions that were already sent, which isn't a real option.
  const answersLocked = isDecided || (caseItem.questionsSubmitted && !isNmi);
  // Sent to the prescriber via Contact Prescriber, but the prescriber hasn't submitted
  // from their own secure-link view yet — distinct from answersLocked (nothing has been
  // formally submitted to the Payer at this point, so it isn't Under Payer Review).
  const awaitingPrescriber = caseItem.prescriberContacted && !answersLocked && !isNmi;

  // Same gating as Benefit Investigation — Prior Authorization can't have started, let
  // alone been determined unnecessary, if Coverage Determination hasn't cleared yet.
  if (caseItem.eligibilityStatus !== "success") {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900">Prior Authorization</h3>
        <EmptyPlaceholder text="Prior Authorization hasn't started — this case is still at the Coverage Determination stage and needs to clear there first." />
      </div>
    );
  }

  if (!caseItem.paRequired) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900">Prior Authorization</h3>
        <EmptyPlaceholder text="Prior Authorization is not required for this case — there is nothing to review here." />
      </div>
    );
  }

  const questionsContent = () => {
    // Once a second round has been submitted, that's the most recent thing the Payer is
    // actually reviewing — show it (read-only) even after paStatus has cleared back out
    // of "Payer Needs More Information", rather than reverting to round one's answers.
    if (caseItem.additionalQuestionsSubmitted && !isNmi) {
      return <ClinicalQuestionsReadOnly questions={PA_QUESTIONS_ADDITIONAL} answers={caseItem.additionalAnswers || []} status={getCaseStatusInfo(caseItem).label} />;
    }
    if (isNmi) {
      if (caseItem.nmiChannel === "question_set") {
        const nmiBanner = (
          <div className="flex items-start gap-2 rounded-md border border-purple-200 bg-purple-50 px-3.5 py-3 text-xs text-purple-700">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Payer needs more information</p>
              <p className="mt-0.5 text-purple-600">
                The Payer has sent a new set of questions back through AnvayaRx before completing their review of{" "}
                {caseItem.moreInfoRequested || "this request"}.
              </p>
            </div>
          </div>
        );
        if (caseItem.additionalQuestionsSubmitted) {
          return <ClinicalQuestionsReadOnly questions={PA_QUESTIONS_ADDITIONAL} answers={caseItem.additionalAnswers || []} status="Under Payer Review" />;
        }
        // Round 2 gets its own Contact Prescriber cycle, independent of round 1's — the
        // prescriber is ultimately who submits either way, so the option needs to be here
        // too, not just on the original questionnaire.
        if (caseItem.prescriberContactedRound2) {
          return (
            <div className="flex flex-col gap-4">
              {nmiBanner}
              <AwaitingPrescriberInputPanel
                questions={PA_QUESTIONS_ADDITIONAL}
                caseItem={caseItem}
                onOpenPrescriberDemo={() => onOpenPrescriberDemo?.(2)}
                sentAnswers={caseItem.prescriberSentAnswersRound2}
              />
            </div>
          );
        }
        if (readOnly) {
          return (
            <div className="flex flex-col gap-4">
              {nmiBanner}
              <ReadOnlyCaseNotice />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-4">
            {nmiBanner}
            <ClinicalQuestionsTab
              questions={PA_QUESTIONS_ADDITIONAL}
              onSubmitAnswers={onSubmitAdditionalAnswers}
              caseItem={caseItem}
              onContactPrescriber={onContactPrescriberAdditional}
            />
          </div>
        );
      }
      // Payer reached out to the prescriber directly (email or call/fax) — nothing new
      // happened within AnvayaRx's own questionnaire, so Clinical Questions just shows
      // the original submission read-only; the outreach itself lives on the PA Status
      // tab, since it's a statement about where the determination stands, not a question.
      return (
        <ClinicalQuestionsReadOnly
          questions={PA_QUESTIONS}
          answers={caseItem.submittedAnswers || PA_QUESTION_ANSWERS}
          documents={caseItem.submittedAnswers ? undefined : PA_QUESTION_DOCUMENTS}
          status={getCaseStatusInfo(caseItem).label}
        />
      );
    }
    if (answersLocked) {
      return (
        <ClinicalQuestionsReadOnly
          questions={PA_QUESTIONS}
          answers={caseItem.submittedAnswers || PA_QUESTION_ANSWERS}
          documents={caseItem.submittedAnswers ? undefined : PA_QUESTION_DOCUMENTS}
          status={getCaseStatusInfo(caseItem).label}
        />
      );
    }
    if (awaitingPrescriber) {
      return <AwaitingPrescriberInputPanel questions={PA_QUESTIONS} caseItem={caseItem} onOpenPrescriberDemo={() => onOpenPrescriberDemo?.(1)} sentAnswers={caseItem.prescriberSentAnswers} />;
    }
    if (readOnly) {
      return <ReadOnlyCaseNotice />;
    }
    return (
      <ClinicalQuestionsTab
        questions={PA_QUESTIONS}
        savedDraft={savedDraft}
        onSaveDraft={onSaveDraft}
        onSubmitAnswers={onSubmitAnswers}
        caseItem={caseItem}
        onContactPrescriber={onContactPrescriber}
      />
    );
  };

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
      <div className="pt-2">{subTab === "questions" ? questionsContent() : <PAStatusTab caseItem={caseItem} />}</div>
    </div>
  );
}

// ---- Screen shell: pentagon stepper is fully free-navigation across all 6 stages ----

function CorePAScreen({ caseItem, initialTab, initialStage, onBack, onUpdateCase, paAnswerDrafts, onSavePaDraft, onSubmitAnswers, onContactPrescriber, onOpenPrescriberDemo, onSubmitAdditionalAnswers, readOnly }) {
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
        return (
          <PriorAuthorizationStage
            caseItem={caseItem}
            initialSubTab={initialTab}
            savedDraft={paAnswerDrafts?.[caseItem.caseId]}
            onSaveDraft={(draft) => onSavePaDraft?.(caseItem.caseId, draft)}
            onSubmitAnswers={(answers) => onSubmitAnswers?.(caseItem.caseId, answers)}
            onContactPrescriber={(answersSoFar) => onContactPrescriber?.(caseItem.caseId, answersSoFar, 1)}
            onOpenPrescriberDemo={(round) => onOpenPrescriberDemo?.(caseItem.caseId, round)}
            onSubmitAdditionalAnswers={(answers) => onSubmitAdditionalAnswers?.(caseItem.caseId, answers)}
            onContactPrescriberAdditional={(answersSoFar) => onContactPrescriber?.(caseItem.caseId, answersSoFar, 2)}
            readOnly={readOnly}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Case Details</h1>
            <p className="text-xs text-slate-500">{caseItem.caseId}</p>
          </div>
        </div>
        {caseItem.eligibilityStatus === "failed" && !readOnly && (
          <button onClick={onUpdateCase} className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Pencil size={14} /> Update Case
          </button>
        )}
      </div>

      <Card className="p-0">
        <EnrollmentBreadcrumbs tabs={CORE_STAGE_LABELS} activeTab={activeStage} onSelect={setActiveStage} />
      </Card>

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
            <div>
              <p className="text-slate-400">Drug</p>
              <p className="font-medium text-slate-700">{caseItem.drugName || caseItem.programme || "—"}</p>
            </div>
            <div>
              <p className="text-slate-400">Prescriber</p>
              <p className="font-medium text-slate-700">{caseItem.prescriberName || "Not on file"}</p>
            </div>
            <div>
              <p className="text-slate-400">Servicing Provider</p>
              <p className="font-medium text-slate-700">{caseItem.servicingProviderName || "Same as Prescriber"}</p>
            </div>
            <div>
              <p className="text-slate-400">Pharmacy</p>
              <p className="font-medium text-slate-700">{caseItem.pharmacyName || "Not on file"}</p>
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

function CaseTrackingScreen({ onView, showProgramme = false, caseRows = CASE_TRACKING_ROWS }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const stageOptions = ["All Stages", ...CORE_STAGE_LABELS];

  const filteredRows = caseRows.filter((row) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || row.patient.toLowerCase().includes(q) || row.caseId.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All Statuses" || getCaseStatusInfo(row).label === statusFilter;
    const matchesStage = stageFilter === "All Stages" || CORE_STAGE_LABELS[getCoreStageIndex(row)] === stageFilter;
    return matchesSearch && matchesStatus && matchesStage;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Case Status</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor and manage all active patient cases.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex w-64 items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2.5">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or case ID"
              className="w-full text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2.5">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-sm font-medium text-slate-600 outline-none">
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="shrink-0 text-slate-400" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2.5">
            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="bg-transparent text-sm font-medium text-slate-600 outline-none">
              {stageOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="shrink-0 text-slate-400" />
          </div>
        </div>
      </div>

      <Card className="overflow-visible p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Case ID</th>
              {showProgramme && <th className="px-4 py-3 font-semibold">Program</th>}
              <th className="px-4 py-3 font-semibold">Stage</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Urgency</th>
              <th className="px-4 py-3 font-semibold">SLA Due</th>
              <th className="px-4 py-3 font-semibold">Enrollment Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={showProgramme ? 9 : 8} className="px-4 py-10 text-center text-sm text-slate-400">
                  No cases match your search and filters.
                </td>
              </tr>
            )}
            {filteredRows.map((row, idx) => (
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
                {showProgramme && <td className="px-4 py-3 text-slate-500">{row.programme || "—"}</td>}
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
          <span>
            1–{Math.min(10, filteredRows.length)} of {filteredRows.length} cases
          </span>
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



function CaseDetailScreen({ caseItem, onBack, onUpdateCase, readOnly }) {
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
        {caseItem.eligibilityStatus === "failed" && !readOnly && (
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
  "xyz@yopmail.com": { password: "Admin@123", hasAnvayaRxAccess: true, displayName: "Xyz Test", role: "All Portal Admin" },
  "pqr@yopmail.com": { password: "Admin@123", hasAnvayaRxAccess: false, displayName: "Pqr Test", role: "All Portal User" },
  "enrollmentuser@yopmail.com": { password: "Admin@123", hasAnvayaRxAccess: true, displayName: "Enrollment User Test", role: "Enrollment User" },
  "caseactionuser@yopmail.com": { password: "Admin@123", hasAnvayaRxAccess: true, displayName: "Case Action User Test", role: "Case Action User" },
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

const USER_ROLE_OPTIONS = ["All Portal Admin", "All Portal User", "Case Action User", "Enrollment User"];
// Shown under the role dropdown wherever a role is picked (Invite, Edit) so it's never a
// bare label — every role states what screens it opens and what it actually lets someone do.
const USER_ROLE_DESCRIPTIONS = {
  "All Portal Admin": "Everything All Portal User has, plus Users — can invite teammates and assign roles.",
  "All Portal User": "Full working access: Enrollment, Case Status (including taking action on a case), Task, and Reports.",
  "Case Action User": "Works cases end to end — Case Status and Task, including answering clinical questions and using Contact Prescriber. No access to Enrollment or Reports.",
  "Enrollment User": "Creates and submits Enrollments, and can see a case's status progress — but can't take any action on a case (no answering questions, no updates).",
};

const PARTNER_ENROLLMENT_USERS = [
  { id: "abc-u1", name: "Testuser One", role: "All Portal Admin", email: "muskan3011kumari@gmail.com", status: "Active", invited: "Jul 8, 2026" },
  { id: "abc-u2", name: "Aa Aa", role: "All Portal Admin", email: "sb6qnxmmir@ozsaip.com", status: "Active", invited: "Jun 27, 2026" },
  { id: "abc-u3", name: "Aa Aa", role: "All Portal User", email: "sb6qnxmmir@ozsaip.com", status: "Active", invited: "Jun 27, 2026" },
  { id: "abc-u4", name: "Test Test", role: "Enrollment User", email: "bokog59490@adsprite.com", status: "Active", invited: "Jun 24, 2026" },
  { id: "abc-u5", name: "Emma Mark", role: "All Portal Admin", email: "john.anderson_55@yopmail.com", status: "Active", invited: "Jun 23, 2026" },
  { id: "abc-u6", name: "Mas Mas", role: "Case Action User", email: "mas@d.com", status: "Active", invited: "Jun 21, 2026" },
  { id: "abc-u7", name: "Pqr Test", role: "All Portal Admin", email: "pqr@yopmail.com", status: "Active", invited: "Jun 15, 2026" },
  { id: "abc-u8", name: "Jay Bafna", role: "All Portal User", email: "jaybafna@yopmail.com", status: "Active", invited: "Jun 14, 2026" },
  { id: "abc-u9", name: "Abc", role: "All Portal Admin", email: "abc@yopmail.com", status: "Active", invited: "Jun 10, 2026" },
  { id: "abc-u10", name: "Xyz Test", role: "All Portal Admin", email: "xyz@yopmail.com", status: "Active", invited: "Jun 10, 2026" },
];

// Only reachable at all once AnvayaRx Admin has enabled self-service user
// management for this Partner (PARTNER_USER_MANAGEMENT_ENABLED above) --
// otherwise Core's nav never offers a Users tab in the first place. Once
// enabled, this is the same screen, same Invite User flow, and same data
// the AnvayaRx Admin already manages on this Partner's behalf (Section 4.2.2)
// -- the Partner is now doing it themselves instead.
// Styled hover tooltip standing in for the old always-visible "Roles at a glance" card —
// the permission info is still one hover away, it just doesn't take up permanent space.
// `roles` takes one role name (badge in the table) or the full USER_ROLE_OPTIONS list
// (column header, so hovering "Role" once shows what every role means).
function RoleInfoTooltip({ roles, children }) {
  const list = Array.isArray(roles) ? roles : [roles];
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute left-0 top-full z-20 mt-1.5 hidden w-72 rounded-md border border-slate-200 bg-white p-3 text-left normal-case shadow-lg group-hover:block">
        {list.map((r) => (
          <span key={r} className="mb-2 block last:mb-0">
            <span className="block text-xs font-bold text-slate-800">{r}</span>
            <span className="text-[11px] font-normal leading-snug text-slate-500">{USER_ROLE_DESCRIPTIONS[r]}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

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
          <div className="w-64">
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
            <p className="mt-1.5 text-[11px] leading-snug text-slate-500">{USER_ROLE_DESCRIPTIONS[inviteRole]}</p>
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
              <th className="px-4 py-3 font-semibold">
                <RoleInfoTooltip roles={USER_ROLE_OPTIONS}>
                  <span className="inline-flex cursor-help items-center gap-1 border-b border-dotted border-slate-300">
                    Role <Info size={11} className="text-slate-400" />
                  </span>
                </RoleInfoTooltip>
              </th>
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
                    <div>
                      <select
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-400 focus:outline-none"
                      >
                        {USER_ROLE_OPTIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      <p className="mt-1 max-w-[220px] text-[10px] leading-snug text-slate-500">{USER_ROLE_DESCRIPTIONS[editingRole]}</p>
                    </div>
                  ) : (
                    <RoleInfoTooltip roles={u.role}>
                      <span className="cursor-help rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">{u.role}</span>
                    </RoleInfoTooltip>
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

function AnvayaRxApp({ userEmail, userName, userRole, onBackToPartner, onLogout }) {
  // Each role's nav is an allow-list, not a visually-disabled full list — screens the role
  // can't reach stay out of the nav entirely rather than showing up greyed out.
  const NAV_BY_ROLE = {
    "Enrollment User": ["dashboard", "enrollment", "case-status"],
    "Case Action User": ["dashboard", "case-status", "tasks"],
    "All Portal User": ["dashboard", "enrollment", "case-status", "tasks", "reports"],
    "All Portal Admin": ["dashboard", "enrollment", "case-status", "tasks", "reports", "users"],
  };
  const visibleNavItems = NAV_ITEMS.filter((n) => (NAV_BY_ROLE[userRole] || NAV_BY_ROLE["All Portal User"]).includes(n.key));
  // Enrollment User can see a case's status progress but can't act on it — no answering
  // questions, no Contact Prescriber, no Update Case. Everyone else who can reach Case
  // Status at all (Case Action User, All Portal User/Admin) has full action rights there.
  const readOnlyCaseAccess = userRole === "Enrollment User";
  const [active, setActive] = useState("dashboard");
  const [enrollmentMode, setEnrollmentMode] = useState(null); // null | "create" | "update" | "view" | "edit"
  const [enrollmentCase, setEnrollmentCase] = useState(null);
  const [viewingEnrollmentId, setViewingEnrollmentId] = useState(null);
  const [enrollmentSavedFormData, setEnrollmentSavedFormData] = useState(null);
  // Case Status and Patient both drill into their own sub-screens without leaving the tab —
  // this tracks which one, so the single shared shell below can route to the right content.
  const [caseStatusView, setCaseStatusView] = useState({ screen: "list" }); // { screen: "list" } | { screen: "action", caseId, tab? }
  const [acknowledgedTasks, setAcknowledgedTasks] = useState(new Set());
  // Prior Authorization Clinical Questions drafts, keyed by caseId — surviving navigating
  // away and back is the whole point of "Save as Draft"; a component-local state that
  // resets on remount would make the button lie about what it does.
  const [paAnswerDrafts, setPaAnswerDrafts] = useState({});
  // Contact Prescriber state, keyed by caseId — applied as an override on top of whichever
  // case row it belongs to (session-created or one of the static demo rows) wherever case
  // status is derived, so the flow works the same regardless of where the case came from.
  const [prescriberContactState, setPrescriberContactState] = useState({});
  // Which case, if any, is currently being viewed through the prescriber's own secure-link
  // experience (demo only) — set, the whole screen swaps to PrescriberSecureLinkFlow.
  const [prescriberPortalCaseId, setPrescriberPortalCaseId] = useState(null);
  // "Payer Needs More Information" / additional-questions round state, keyed by caseId —
  // same override-map pattern as prescriberContactState, so it works for session-created
  // cases and the static demo rows (Krish Watson, Owen Delgado, Fatima Hassan) alike.
  const [additionalInfoState, setAdditionalInfoState] = useState({});
  // Enrollments saved as a Draft this session — merged with the static ENROLLMENTS list
  // wherever it's displayed, so hitting Save actually shows up in the Enrollment tab.
  const [sessionDraftEnrollments, setSessionDraftEnrollments] = useState([]);
  // Cases created this session via Create Enrollment — merged with CASE_TRACKING_ROWS
  // wherever Cases are displayed, so a successful submission genuinely shows up in
  // Case Status and on the Dashboard, not just in a confirmation message.
  const [sessionCreatedCases, setSessionCreatedCases] = useState([]);
  // Tasks created this session as a case progresses (Answer PA Questions, then PA
  // Status) — merged with the static TASKS list wherever Tasks are displayed.
  const [sessionTasks, setSessionTasks] = useState([]);
  // Tasks marked Completed once their answers are actually submitted — keyed by
  // "caseId:type" so it applies as an override over mergedTasks regardless of whether the
  // task itself lives in sessionTasks (session-created cases) or the static TASKS list.
  const [completedTaskKeys, setCompletedTaskKeys] = useState(new Set());
  // Tracks which session cases already have a progression timer running, so the
  // effect below schedules each transition exactly once per case, not once per render.
  const scheduledTransitions = useRef(new Set());

  // Demo-only progression: a real Case's Coverage Determination/Benefit Investigation and
  // PA decision are asynchronous and can take anywhere from seconds to days (Sections
  // 3.5, 3.6). Here, short timers stand in for that wait so the full Enrollment-to-PA-
  // status journey can be demonstrated end to end in one sitting.
  useEffect(() => {
    sessionCreatedCases.forEach((c) => {
      const key = `${c.caseId}:eligibility`;
      if (c.eligibilityStatus === "pending" && !scheduledTransitions.current.has(key)) {
        scheduledTransitions.current.add(key);
        setTimeout(() => {
          setSessionCreatedCases((prev) =>
            prev.map((row) =>
              row.caseId === c.caseId
                ? { ...row, eligibilityStatus: "success", paRequired: true, stage: "Prior Authorization" }
                : row
            )
          );
          setSessionTasks((prev) => [
            {
              title: "Answer PA Questions",
              type: "pa_questions",
              caseId: c.caseId,
              patient: c.patient,
              caseUrgency: c.caseUrgency,
              status: "Pending",
              dueDate: "—",
              createdAt: "Just now",
            },
            ...prev,
          ]);
        }, 12000);
      }
    });
  }, [sessionCreatedCases]);

  // Shared between this decision timer and handleSubmitAdditionalAnswers's own decision
  // timer below — the actual fields a Case gets on a real decision are identical
  // regardless of which round of questions led to it.
  const buildDecisionFields = (row, willDeny) => {
    const now = new Date();
    const nowStr = now.toLocaleDateString("en-US") + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return {
      paStatus: willDeny ? "Denied" : "Approved",
      urgency: row.caseUrgency,
      dateCreated: row.enrollmentDate === "Just now" ? nowStr : row.enrollmentDate,
      reviewSubmittedDate: nowStr,
      dateClosed: nowStr,
      drugName: (row.programme || "").toUpperCase(),
      routeOfAdministration: row.route || "—",
      prescriberName: row.prescriberName || "Amit Kapoor",
      authorizationId: `AUTH-${Date.now().toString().slice(-7)}`,
      ...(willDeny
        ? { denialReason: "the medication does not meet the plan\u2019s step therapy requirements" }
        : {
            authStartDate: now.toLocaleDateString("en-US"),
            authEndDate: new Date(now.getTime() + 28 * 86400000).toLocaleDateString("en-US"),
            // Reflects what was actually submitted on the enrollment rather than a fixed
            // placeholder — a Tylenol caplet shouldn't come back "1 Syringe" approved.
            approvedQuantity: row.quantity || "—",
            approvedDaysSupply: row.daysSupply ? `${row.daysSupply} days` : "—",
          }),
    };
  };

  // Once the Partner submits answers for a session-created case, mark that case's
  // questions submitted, retire the "Answer PA Questions" Task, and — after a short
  // delay standing in for the Payer's asynchronous review — deliver a PA decision and
  // its own "PA Status" Task, exactly as Section 3.7 describes.
  const handleSubmitAnswers = (caseId, answers) => {
    setSessionCreatedCases((prev) => prev.map((row) => (row.caseId === caseId ? { ...row, questionsSubmitted: true, submittedAnswers: answers } : row)));
    // Marked Completed (not removed) via the override below — so it stays visible,
    // capturing the fact that these particular answers really were submitted.
    setCompletedTaskKeys((prev) => new Set(prev).add(`${caseId}:pa_questions`));
    const key = `${caseId}:decision`;
    if (!scheduledTransitions.current.has(key)) {
      scheduledTransitions.current.add(key);
      setTimeout(() => {
        // A Member ID of "DENYTEST" demonstrates the Denied outcome, and "NMITEST"
        // demonstrates the Payer sending a second round of questions back through
        // AnvayaRx (Payer Needs More Information) instead of a decision — every other
        // case is Approved, matching the happy path being the common case.
        const caseRow = sessionCreatedCases.find((r) => r.caseId === caseId);
        const memberIdUpper = (caseRow?.memberId || "").trim().toUpperCase();
        const willDeny = memberIdUpper === "DENYTEST";
        const willNmi = memberIdUpper === "NMITEST";
        setSessionCreatedCases((prev) =>
          prev.map((row) => {
            if (row.caseId !== caseId) return row;
            if (willNmi) {
              const now = new Date();
              const nowStr = now.toLocaleDateString("en-US") + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              return {
                ...row,
                paStatus: "Payer Needs More Information",
                nmiChannel: "question_set",
                moreInfoRequested: "additional clinical documentation supporting continued need for this therapy",
                nmiRequestedAt: nowStr,
              };
            }
            return { ...row, ...buildDecisionFields(row, willDeny) };
          })
        );
        setSessionTasks((prev) => [
          willNmi
            ? {
                title: "Answer Additional PA Questions",
                type: "pa_questions_additional",
                caseId,
                patient: caseRow?.patient || "",
                caseUrgency: caseRow?.caseUrgency || "Not Urgent",
                status: "Pending",
                dueDate: "—",
                createdAt: "Just now",
              }
            : {
                title: "PA Status",
                type: "pa_status",
                caseId,
                patient: caseRow?.patient || "",
                caseUrgency: caseRow?.caseUrgency || "Not Urgent",
                status: "Pending",
                dueDate: "—",
                createdAt: "Just now",
              },
          ...prev,
        ]);
      }, 15000);
    }
  };

  // Second-round counterpart to handleSubmitAnswers, for when a case is sitting in
  // "Payer Needs More Information" with the additional-questions channel. Clears the NMI
  // status back to a plain submitted state (Under Payer Review) via the override map —
  // works for the static demo cases (Krish Watson etc.) exactly like the live path.
  const handleSubmitAdditionalAnswers = (caseId, answers) => {
    const now = new Date();
    const nowStr = now.toLocaleDateString("en-US") + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const caseRow = sessionCreatedCases.find((r) => r.caseId === caseId) || CASE_TRACKING_ROWS.find((r) => r.caseId === caseId);
    const willDeny = (caseRow?.memberId || "").trim().toUpperCase() === "DENYTEST";
    setAdditionalInfoState((prev) => ({ ...prev, [caseId]: { ...prev[caseId], submitted: true, answers, submittedAt: nowStr } }));
    // Marked Completed (not removed) via the override below, same as round one.
    setCompletedTaskKeys((prev) => new Set(prev).add(`${caseId}:pa_questions_additional`));
    const key = `${caseId}:decision2`;
    if (!scheduledTransitions.current.has(key)) {
      scheduledTransitions.current.add(key);
      setTimeout(() => {
        setAdditionalInfoState((prev) => ({
          ...prev,
          [caseId]: { ...prev[caseId], decided: true, decisionFields: caseRow ? buildDecisionFields(caseRow, willDeny) : { paStatus: willDeny ? "Denied" : "Approved" } },
        }));
        setSessionTasks((prev) => [
          {
            title: "PA Status",
            type: "pa_status",
            caseId,
            patient: caseRow?.patient || "",
            caseUrgency: caseRow?.caseUrgency || "Not Urgent",
            status: "Pending",
            dueDate: "—",
            createdAt: "Just now",
          },
          ...prev,
        ]);
      }, 15000);
    }
  };

  // Contact Prescriber — Partner side, for either round of questions. Stores what's been
  // answered so far as the payload (both channels get the same content) and flips status
  // to Awaiting Prescriber Input via the override map — keyed by round so the first
  // round's Contact Prescriber history is never clobbered by a second round's, and vice
  // versa. Works whether the case is session-created or one of the static demo rows.
  const handleContactPrescriber = (caseId, answersSoFar, round = 1) => {
    const now = new Date();
    const nowStr = now.toLocaleDateString("en-US") + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const key = `${caseId}:${round}`;
    setPrescriberContactState((prev) => ({
      ...prev,
      [key]: { ...prev[key], contacted: true, contactedAt: nowStr, sentAnswers: answersSoFar, submitted: false },
    }));
  };

  // Prescriber side, from the secure-link questionnaire — marks that round's questions
  // submitted and hands off to the matching decision timer (round 1: the original
  // PA-decision timer; round 2: handleSubmitAdditionalAnswers's own), so the rest of the
  // journey plays out exactly as it would for a Partner-submitted case either way.
  const handlePrescriberSubmit = (caseId, answers, round = 1) => {
    const now = new Date();
    const nowStr = now.toLocaleDateString("en-US") + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const key = `${caseId}:${round}`;
    setPrescriberContactState((prev) => ({
      ...prev,
      [key]: { ...prev[key], submitted: true, submittedAt: nowStr, sentAnswers: answers },
    }));
    if (round === 2) {
      handleSubmitAdditionalAnswers(caseId, answers);
    } else {
      handleSubmitAnswers(caseId, answers);
    }
  };

  const handleSaveEnrollmentDraft = (formData, existingEnrollmentId) => {
    const patientName = [formData.patient.firstName, formData.patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
    setSessionDraftEnrollments((prev) => {
      const id = existingEnrollmentId || `ENR-DRAFT-${Date.now().toString().slice(-6)}`;
      const existingIdx = prev.findIndex((d) => d.enrollmentId === id);
      const draftRow = {
        patient: patientName,
        enrollmentId: id,
        caseId: "Not yet created",
        status: "Draft",
        caseUrgency: formData.payer.urgency || "Not Urgent",
        createdAt: existingIdx >= 0 ? prev[existingIdx].createdAt : "Just now",
        formData,
      };
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = draftRow;
        return next;
      }
      return [draftRow, ...prev];
    });
  };

  // Mirrors the real sequence (Section 3.4.1): by the time this runs, NDC – Drug
  // Description verification and Program assignment have already passed, and Agadia has
  // returned a 2xx on the enrollment package — this is the moment the Case is actually
  // created, not any earlier point in the form.
  const handleCreateEnrollment = (formData) => {
    const patientName = [formData.patient.firstName, formData.patient.lastName].filter(Boolean).join(" ") || "Unnamed Patient";
    const caseId = `CASE-${Date.now().toString().slice(-5)}`;
    const prescriberFullName = [formData.prescriber.firstName, formData.prescriber.lastName].filter(Boolean).join(" ") || "the prescriber";
    const selectedPayer = PAYER_LIST.find((p) => p.name === formData.payer.name);
    const newCase = {
      patient: patientName,
      memberId: formData.patient.memberId || "—",
      caseId,
      payerName: formData.payer.name || "—",
      programme: formData.prescription.drugDescription || "Drug Program",
      stage: "Data & Intake",
      status: "Open",
      caseUrgency: formData.payer.urgency || "Not Urgent",
      slaDue: "—",
      overdue: false,
      enrollmentDate: "Just now",
      eligibilityStatus: "pending",
      intakeChannel: "Embedded UI",
      prescriberName: prescriberFullName,
      prescriberEmail: formData.prescriber.email || "",
      prescriberPhone: formData.prescriber.phone || "",
      servicingProviderName: formData.servicingProvider.sameAsPrescriber
        ? null
        : [formData.servicingProvider.firstName, formData.servicingProvider.lastName].filter(Boolean).join(" ") || null,
      pharmacyName: formData.pharmacy.businessName || "",
      route: formData.prescription.route || "",
      daysSupply: formData.prescription.daysSupply || "",
      quantity: formData.prescription.quantity || "",
      requiresPrescriberSubmission: Boolean(selectedPayer?.requiresPrescriberSubmission),
    };
    setSessionCreatedCases((prev) => [newCase, ...prev]);
    // A submitted enrollment is no longer a Draft — retire it from the Enrollment list.
    setSessionDraftEnrollments((prev) => prev.filter((d) => JSON.stringify(d.formData) !== JSON.stringify(formData)));
    return newCase;
  };

  const handleNavClick = (key) => {
    setActive(key);
    setEnrollmentMode(null);
    setEnrollmentCase(null);
    setViewingEnrollmentId(null);
    setCaseStatusView({ screen: "list" });
  };

  // Tasks deep-link straight into a case's Prior Authorization pentagon — Clinical Questions
  // vs. PA Status is just which sub-tab opens within it.
  const openCoreDeepLink = (caseId, tab) => {
    setActive("case-status");
    setCaseStatusView({ screen: "action", caseId, tab });
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
    setEnrollmentSavedFormData(enrollmentRow.formData || null);
    setEnrollmentMode("edit");
  };

  const handleOpenLinkedCase = (caseId) => {
    setActive("case-status");
    const row = mergedCaseRows.find((c) => c.caseId === caseId);
    const isDecidedCase = row && row.paStatus && row.paStatus !== "Payer Needs More Information";
    setCaseStatusView({ screen: "action", caseId, tab: isDecidedCase ? "status" : undefined });
  };

  // Session-saved drafts take priority over the static list — editing and re-saving an
  // existing draft updates it in place rather than appearing twice.
  const mergedEnrollments = [...sessionDraftEnrollments, ...ENROLLMENTS.filter((e) => !sessionDraftEnrollments.some((d) => d.enrollmentId === e.enrollmentId))];
  // Contact Prescriber's state is applied as an override on top of the merged case row —
  // this is what lets getCaseStatusInfo (and everything downstream) see "prescriberContacted"
  // / the prescriber's in-progress answers, for both session-created AND static demo cases.
  const mergedCaseRows = [...sessionCreatedCases, ...CASE_TRACKING_ROWS].map((row) => {
    let out = row;
    const pc1 = prescriberContactState[`${row.caseId}:1`];
    if (pc1) {
      out = {
        ...out,
        prescriberContacted: pc1.contacted,
        prescriberContactedAt: pc1.contactedAt,
        prescriberSentAnswers: pc1.sentAnswers,
        ...(pc1.submitted ? { questionsSubmitted: true, submittedAnswers: pc1.sentAnswers } : {}),
      };
    }
    const pc2 = prescriberContactState[`${row.caseId}:2`];
    if (pc2) {
      out = {
        ...out,
        prescriberContactedRound2: pc2.contacted,
        prescriberContactedAtRound2: pc2.contactedAt,
        prescriberSentAnswersRound2: pc2.sentAnswers,
      };
    }
    const ai = additionalInfoState[row.caseId];
    if (ai) {
      out = {
        ...out,
        additionalQuestionsSubmitted: Boolean(ai.submitted),
        additionalAnswers: ai.answers,
        ...(ai.decided ? { ...ai.decisionFields } : ai.submitted ? { paStatus: undefined } : {}),
      };
    }
    return out;
  });
  const mergedTasks = [...sessionTasks, ...TASKS].map((t) => (completedTaskKeys.has(`${t.caseId}:${t.type}`) ? { ...t, status: "Completed" } : t));

  let content;
  if (active === "dashboard") {
    content = (
      <DashboardScreen
        onNewEnrollment={() => {
          setActive("enrollment");
          setEnrollmentMode("create");
        }}
        onViewTasks={() => handleNavClick("tasks")}
        onOpenCase={handleOpenLinkedCase}
        caseRows={mergedCaseRows}
        tasks={mergedTasks}
        showEnrollment={visibleNavItems.some((n) => n.key === "enrollment")}
      />
    );
  } else if (active === "enrollment") {
    if (enrollmentMode === "create") {
      content = <EnrollmentForm mode="create" caseItem={null} onBack={() => setEnrollmentMode(null)} onSaveDraft={handleSaveEnrollmentDraft} onCreateEnrollment={handleCreateEnrollment} />;
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
          savedFormData={enrollmentSavedFormData}
          onSaveDraft={handleSaveEnrollmentDraft}
          onBack={() => {
            setEnrollmentMode(null);
            setEnrollmentCase(null);
            setViewingEnrollmentId(null);
            setEnrollmentSavedFormData(null);
          }}
        />
      );
    } else {
      content = <EnrollmentsListScreen enrollments={mergedEnrollments} onNew={() => setEnrollmentMode("create")} onEdit={handleEditEnrollment} />;
    }
  } else if (active === "case-status") {
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
    } else if (caseStatusView.screen === "action") {
      // Same case, same table — but the action button now opens the real interactive
      // pentagon workflow directly (clickable stages, clinical questions, PA status),
      // not a read-only summary. This is the merge: one screen for both status and action.
      const linkedCase = mergedCaseRows.find((c) => c.caseId === caseStatusView.caseId) || { caseId: caseStatusView.caseId, patient: "Unknown Patient", caseUrgency: "Not Urgent" };
      content = (
        <CorePAScreen
          caseItem={linkedCase}
          initialTab={caseStatusView.tab}
          initialStage={caseStatusView.tab ? 3 : getCoreStageIndex(linkedCase)}
          onBack={() => setCaseStatusView({ screen: "list" })}
          onUpdateCase={() => {
            setEnrollmentCase(linkedCase);
            setEnrollmentMode("update");
          }}
          paAnswerDrafts={paAnswerDrafts}
          onSavePaDraft={(caseId, draft) => setPaAnswerDrafts((prev) => ({ ...prev, [caseId]: draft }))}
          onSubmitAnswers={handleSubmitAnswers}
          onContactPrescriber={handleContactPrescriber}
          onOpenPrescriberDemo={(caseId, round) => setPrescriberPortalCaseId({ caseId, round: round || 1 })}
          onSubmitAdditionalAnswers={handleSubmitAdditionalAnswers}
          readOnly={readOnlyCaseAccess}
        />
      );
    } else {
      content = (
        <CaseTrackingScreen
          onView={(c) => {
            const isDecidedCase = c.paStatus && c.paStatus !== "Payer Needs More Information";
            setCaseStatusView({ screen: "action", caseId: c.caseId, tab: isDecidedCase ? "status" : undefined });
          }}
          caseRows={mergedCaseRows}
        />
      );
    }
  } else if (active === "tasks") {
    content = (
      <TasksScreen
        onOpenCoreDeepLink={openCoreDeepLink}
        acknowledgedTasks={acknowledgedTasks}
        onAcknowledge={(key) => setAcknowledgedTasks((prev) => new Set(prev).add(key))}
        tasks={mergedTasks}
      />
    );
  } else if (active === "reports") {
    content = <ReportsScreen caseRows={mergedCaseRows} />;
  } else if (active === "users") {
    content = <PartnerUsersScreen />;
  } else {
    content = <ComingSoonScreen label={visibleNavItems.find((n) => n.key === active)?.label || ""} />;
  }

  const hasPendingTasks = mergedTasks.some((t) => t.status === "Pending" && !acknowledgedTasks.has(taskKey(t)));

  // Demo-only detour: viewing the prescriber's own secure-link experience swaps out the
  // entire Partner shell below — it's a genuinely separate, unauthenticated context, not
  // a screen reachable from the Partner's own nav.
  if (prescriberPortalCaseId) {
    const { caseId: portalCaseId, round: portalRound } = prescriberPortalCaseId;
    const portalCase = mergedCaseRows.find((c) => c.caseId === portalCaseId) || { caseId: portalCaseId, patient: "Unknown Patient" };
    const portalQuestions = portalRound === 2 ? PA_QUESTIONS_ADDITIONAL : PA_QUESTIONS;
    return (
      <PrescriberSecureLinkFlow
        caseItem={portalCase}
        questions={portalQuestions}
        initialAnswers={prescriberContactState[`${portalCaseId}:${portalRound}`]?.sentAnswers}
        onSubmit={(answers) => {
          handlePrescriberSubmit(portalCaseId, answers, portalRound);
        }}
        onExit={() => setPrescriberPortalCaseId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8F9FB] font-sans text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-indigo-600" />
          <div>
            <p className="text-sm font-bold leading-tight">AnvayaRx</p>
            <p className="text-[11px] leading-tight text-slate-500">Prior Authorization Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isActive ? "bg-indigo-100 font-medium text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="relative">
                  <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                  {item.key === "tasks" && hasPendingTasks && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
                </span>
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
  // "partner-login" | "partner-dashboard" | "sso-mediator" | "access-denied" | "anvayarx"
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
          // Enrollment Portal and Core no longer live behind a module-selector step —
          // SSO now lands directly on the combined AnvayaRx experience (single Dashboard,
          // single nav) rather than asking the Partner to pick between two portals first.
          setStage(account?.hasAnvayaRxAccess ? "anvayarx" : "access-denied");
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
  const userRole = account?.role || "All Portal Admin";
  const backToPartner = () => setStage("partner-dashboard");
  const logout = () => {
    setCurrentEmail("");
    setStage("partner-login");
  };

  return (
    <AnvayaRxApp
      userEmail={userEmail}
      userName={userName}
      userRole={userRole}
      onBackToPartner={backToPartner}
      onLogout={logout}
    />
  );
}
