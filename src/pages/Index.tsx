import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import AdmitCardForm from '../components/AdmitCardForm';
import AdmitCardPreview from '@/components/AdmitCardPreview';
import { PLACEHOLDER_URLS } from '@/utils/imageUtils';

// Initial default admit card data
const formatCurrentDateTime = () => {
  const now = new Date();
  return `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear().toString().slice(2)}    ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
};

// Remove the duplicate printDateTime
  const defaultAdmitCardData: AdmitCardData = {
    schoolName: 'Chaudhary Charan Singh University, Meerut',
    schoolLogo: PLACEHOLDER_URLS.logo,
    sessionYears: '2023-2024',
    
    examCenterName: '[108] - SWAMI KALYAN DEV COLLEGE HASTINAPUR',
    collegeName: '[0108] - SWAMI KALYAN DEV COLLEGE HASTINAPUR',
    programName: 'B.A. - NEP',
    semesterYear: 'Semester 6',
    
    candidateName: 'VANDANA MANDAL',
    fatherName: 'VIBHUTI MANDAL',
    motherName: 'SARASWATI MANDAL',
    enrollmentNumber: '21126975',
    rollNumber: '210108301168',
    
    examFormNumber: '260074238',
    examCategory: 'Regular',
    examType: 'Main',
    category: 'UNRESERVED',
    gender: 'Female',
    
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
    
    printDateTime: '5/13/24    6:03 PM',
    // Remove the second printDateTime
  };

const Index = () => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [admitCardData, setAdmitCardData] = useState<AdmitCardData>(defaultAdmitCardData);
  
  const handleDataChange = (data: AdmitCardData) => {
    setAdmitCardData(data);
  };
  
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Tabs defaultValue="form" className="h-full">
          <div className="flex items-center justify-center p-4 bg-white border-b">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="form">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="form" className="h-[calc(100vh-73px)] overflow-hidden">
            <AdmitCardForm 
              onDataChange={handleDataChange} 
              canvasRef={canvasRef}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="h-[calc(100vh-73px)] overflow-hidden">
            <AdmitCardPreview 
              data={admitCardData} 
              canvasRef={canvasRef}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen"
      >
        <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
          <AdmitCardForm 
            onDataChange={handleDataChange} 
            canvasRef={canvasRef}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={60} minSize={40} maxSize={70}>
          <AdmitCardPreview 
            data={admitCardData} 
            canvasRef={canvasRef}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
