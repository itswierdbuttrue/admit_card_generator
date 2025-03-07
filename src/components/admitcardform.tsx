import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Building, School, BookOpen, Calendar, User, Users,
  FileText, ListFilter, Tag, BadgeCheck, 
  ImageIcon, FileSignature, PenTool, Download, Image as ImageIcon2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import SubjectsTable, { Subject } from './SubjectsTable';
import { Card, CardContent } from '@/components/ui/card';
import { isImageFile, isSvgOrPng, readImageFile, PLACEHOLDER_URLS } from '@/utils/imageUtils';
import { getCurrentDateTime, downloadAsImage, downloadAsPDF } from '@/utils/downloadUtils';
import { PLACEHOLDER_IMAGES } from '@/utils/imageConstants';
import photoPlaceholder from '@/assets/images/passport_size_photo_placeholder.svg';
import studentSignature from '@/assets/images/student_sign_placeholder.svg';
import controllerSignature from '@/assets/images/controller_of_examination_signature.svg';
import universityLogo from '@/assets/images/university_logo_placceholder.svg';

export interface AdmitCardData {
  // School/University Details
  schoolName: string;
  schoolLogo: string;
  sessionYears: string;

  // Exam Details
  examCenterName: string;
  collegeName: string;
  programName: string;
  semesterYear: string;

  // Candidate Information
  candidateName: string;
  fatherName: string;
  motherName: string;
  enrollmentNumber: string;
  rollNumber: string;

  // Exam Specifics
  examFormNumber: string;
  examCategory: string;
  examType: string;
  category: string;
  gender: string;

  // Student Photo & Signature
  studentPhoto: string;
  studentSignature: string;

  // Subjects
  subjects: Subject[];

  // Print Details
  printDateTime: string;
}

interface AdmitCardFormProps {
  onDataChange: (data: AdmitCardData) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const AdmitCardForm: React.FC<AdmitCardFormProps> = ({ onDataChange, canvasRef }) => {
  const [isLoading, setIsLoading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // Format current date and time
  const formatCurrentDateTime = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  // Initial default admit card data
  const [formData, setFormData] = useState<AdmitCardData>({
    schoolName: 'Chaudhary Charan Singh University, Meerut',
    schoolLogo: PLACEHOLDER_URLS.logo,
    sessionYears: '2022-23',

    examCenterName: '[108] - SWAMI KALYAN DEV COLLEGE HASTINAPUR',
    collegeName: '[0108] - SWAMI KALYAN DEV COLLEGE HASTINAPUR',
    programName: 'B.A. - NEP',
    semesterYear: ' Semester 6',

    candidateName: 'VANDANA MANDAL',
    fatherName: 'VIBHUTI MANDAL',
    motherName: 'SARASWATI MANDAL',
    enrollmentNumber: ' 21126975',
    rollNumber: '  210108301168',

    examFormNumber: '260074238',
    examCategory: ' Regular',
    examType: '  Main',
    category: ' UNRESERVED',
    gender: '  Female',

    studentPhoto: PLACEHOLDER_URLS.photo,
    studentSignature: PLACEHOLDER_URLS.signature,

    subjects: [
      { id: 'subject-1', paperNo: 'Paper - 1', subject: 'ENGLISH', subjectName: 'A040601T-INDIAN & NEW LITERATURES IN ENGLISH' },
      { id: 'subject-2', paperNo: 'Paper - 2', subject: 'ENGLISH', subjectName: 'AD40602T-LITERATURE IN FILMS & MEDIA STUDIES' },
      { id: 'subject-3', paperNo: 'Paper - 3', subject: 'SOCIOLOGY', subjectName: 'A070601T-PIONEERS OF INDIAN SOCIOLOGY' },
      { id: 'subject-4', paperNo: 'Paper - 4', subject: 'SOCIOLOGY', subjectName: 'A070602T GENDER AND SOCIETY' },
      { id: 'subject-5', paperNo: 'Paper - 5', subject: 'SOCIOLOGY', subjectName: 'A070603R-MINOR RESEARCH PROJECT SOCIOLOGY' },
      { id: 'subject-6', paperNo: 'Paper - 6', subject: 'CO-CURRICULAR', subjectName: '208060T-COMMUNICATION SKILLS AND PERSONALITY DEVELOPMENT' },
    ],

    // Make sure printDateTime only appears once
    printDateTime: formatCurrentDateTime(),
    
    // Remove any duplicate printDateTime if it exists
  });

  useEffect(() => {
    // Add a small delay to ensure single render
    const timeoutId = setTimeout(() => {
      onDataChange(formData);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [formData, onDataChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle roll number update in both places
    if (name === 'rollNumber') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectsChange = (subjects: Subject[]) => {
    setFormData(prev => ({
      ...prev,
      subjects
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'schoolLogo' | 'studentPhoto' | 'studentSignature') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (imageType === 'schoolLogo' || imageType === 'studentSignature') {
      if (!isSvgOrPng(file)) {
        toast.error('Only SVG or PNG files are allowed for this field.');
        return;
      }
    } else if (!isImageFile(file)) {
      toast.error('Invalid image file type.');
      return;
    }

    try {
      const dataUrl = await readImageFile(file);

      setFormData(prev => ({
        ...prev,
        [imageType]: dataUrl
      }));

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    }
  };

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!canvasRef.current) {
      toast.error('Canvas not ready. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      const filename = `admit-card-${formData.rollNumber}`;

      if (format === 'png') {
        await downloadAsImage(canvasRef.current, filename);
        toast.success('Admit card downloaded as PNG.');
      } else {
        await downloadAsPDF(canvasRef.current, filename);
        toast.success('Admit card downloaded as PDF.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Admit Card Generator</h2>

        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleDownload('png')}
            disabled={isLoading}
          >
            <ImageIcon2 size={16} className="mr-2" />
            PNG
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={() => handleDownload('pdf')}
            disabled={isLoading}
          >
            <Download size={16} className="mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <Separator />

      {/* School/University Details */}
      <div className="form-section">
        <h3><School size={18} /> School/University Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="schoolName">School/University Name</Label>
            <Input
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionYears">Session Years</Label>
            <Input
              id="sessionYears"
              name="sessionYears"
              value={formData.sessionYears}
              onChange={handleInputChange}
              placeholder="e.g., 2022-23"
            />
          </div>

          <div className="col-span-3">
            <Label htmlFor="schoolLogo">School/University Logo</Label>
            <div
              className={`image-upload-container mt-2`}
              onClick={() => logoInputRef.current?.click()}
            >
              {formData.schoolLogo ? (
                <img 
                  src={formData.schoolLogo} 
                  alt="School Logo" 
                  className="image-upload-preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon size={32} className="text-gray-400" />
                  <span className="image-upload-label">
                    Click to upload logo (SVG or PNG)
                  </span>
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept=".svg,.png"
                onChange={(e) => handleImageUpload(e, 'schoolLogo')}
                className="hidden-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exam Details */}
      <div className="form-section">
        <h3><BookOpen size={18} /> Exam Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="examCenterName">Exam Center Name</Label>
            <Input
              id="examCenterName"
              name="examCenterName"
              value={formData.examCenterName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collegeName">College Name</Label>
            <Input
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="programName">Program Name</Label>
            <Input
              id="programName"
              name="programName"
              value={formData.programName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="semesterYear">Semester/Year</Label>
            <Input
              id="semesterYear"
              name="semesterYear"
              value={formData.semesterYear}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Candidate Information */}
      <div className="form-section">
        <h3><User size={18} /> Candidate Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="candidateName">Candidate Name</Label>
            <Input
              id="candidateName"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherName">Father's Name</Label>
            <Input
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherName">Mother's Name</Label>
            <Input
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
            <Input
              id="enrollmentNumber"
              name="enrollmentNumber"
              value={formData.enrollmentNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Exam Specifics */}
      <div className="form-section">
        <h3><FileText size={18} /> Exam Specifics</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="examFormNumber">Exam Form Number</Label>
            <Input
              id="examFormNumber"
              name="examFormNumber"
              value={formData.examFormNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examCategory">Exam Category</Label>
            <Select
              value={formData.examCategory}
              onValueChange={(value) => handleSelectChange('examCategory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exam category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Ex-Student">Ex-Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="examType">Exam Type</Label>
            <Select
              value={formData.examType}
              onValueChange={(value) => handleSelectChange('examType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main">Main</SelectItem>
                <SelectItem value="Reappear">Reappear</SelectItem>
                <SelectItem value="Improvement">Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNRESERVED">General</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="ST">ST</SelectItem>
                <SelectItem value="OBC">OBC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Student Photo & Signature */}
      <div className="form-section">
        <h3><FileSignature size={18} /> Student Photo & Signature</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <Label className="mb-2 block">Student Photo</Label>
              <div
                className={`image-upload-container`}
                onClick={() => photoInputRef.current?.click()}
              >
                {formData.studentPhoto ? (
                  <img 
                    src={formData.studentPhoto} 
                    alt="Student Photo" 
                    className="image-upload-preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <User size={32} className="text-gray-400" />
                    <span className="image-upload-label">
                      Click to upload photo
                    </span>
                  </div>
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif"
                  onChange={(e) => handleImageUpload(e, 'studentPhoto')}
                  className="hidden-input"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Label className="mb-2 block">Student Signature</Label>
              <div
                className={`image-upload-container`}
                onClick={() => signatureInputRef.current?.click()}
              >
                {formData.studentSignature ? (
                  <img 
                    src={formData.studentSignature} 
                    alt="Student Signature" 
                    className="image-upload-preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <PenTool size={32} className="text-gray-400" />
                    <span className="image-upload-label">
                      Click to upload signature (SVG or PNG)
                    </span>
                  </div>
                )}
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept=".svg,.png"
                  onChange={(e) => handleImageUpload(e, 'studentSignature')}
                  className="hidden-input"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="form-section">
        <h3><ListFilter size={18} /> Subjects</h3>
        <SubjectsTable subjects={formData.subjects} onChange={handleSubjectsChange} />
      </div>

      {/* Print Details */}
      <div className="form-section">
        <h3><Calendar size={18} /> Print Details</h3>

        <div className="space-y-2">
          <Label htmlFor="printDateTime">Print Date & Time</Label>
          <Input
            id="printDateTime"
            name="printDateTime"
            value={formData.printDateTime}
            onChange={handleInputChange}
            placeholder="MM/DD/YY HH:MM AM/PM"
          />
        </div>
      </div>
    </div>
  );
};

export default AdmitCardForm;