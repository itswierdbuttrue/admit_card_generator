import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast as uiToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { Download, Printer, Share2 } from 'lucide-react';
import { getCurrentDateTime, downloadAsPDF, downloadAsImage } from '@/utils/downloadUtils';
import { PLACEHOLDER_IMAGES } from '@/utils/imageConstants';

interface AdmitCardPreviewProps {
  data: any;
  onEdit: () => void;
}

const AdmitCardPreview: React.FC<AdmitCardPreviewProps> = ({ data, onEdit }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generatePreview();
  }, [data]);

  const generatePreview = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Set canvas size to A4 (approximate px at 96 DPI)
      canvas.width = 800;
      canvas.height = 1130;

      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clear previous content
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add university logo
      try {
        const logoImg = await loadImage(data.schoolLogo);
        const logoWidth = 120;
        const logoHeight = 120;
        const logoX = 30;
        const logoY = 60;
        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.error('Could not load university logo:', error);
      }

      // Add university name and header
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(data.schoolName, canvas.width / 2, 75);  // Changed from 90 to 75

      // Add session info
      ctx.font = '16px Arial';
      ctx.fillText(`Provisional Admit Card (Session-${data.sessionYears})`, canvas.width / 2, 105);  // Changed from 120 to 105

      // Remove the line below session
      // Draw line under header - REMOVED

      // Add student photo
      try {
        const photoImg = await loadImage(data.studentPhoto);
        const photoWidth = 120;
        const photoHeight = 140;
        const photoX = canvas.width - 180;
        const photoY = 180;

        // Draw photo border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(photoX - 5, photoY - 5, photoWidth + 10, photoHeight + 10);

        // Draw photo
        ctx.drawImage(photoImg, photoX, photoY, photoWidth, photoHeight);

        // Add student signature right below the photo
        // Add student signature
        try {
          const signatureImg = await loadImage(data.studentSignature);
          ctx.drawImage(signatureImg, photoX, photoY + photoHeight + 2, 120, 30); // Adjusted width and height
        } catch (error) {
          console.error('Could not load student signature:', error);
        }
      } catch (error) {
        console.error('Could not load student photo:', error);

        // Draw placeholder for photo
        const photoX = canvas.width - 150;
        const photoY = 180;
        const photoWidth = 120;
        const photoHeight = 140;

        ctx.fillStyle = '#b30000';
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Photo', photoX + photoWidth/2, photoY + photoHeight/2 - 10);
        ctx.fillText('Here', photoX + photoWidth/2, photoY + photoHeight/2 + 20);
      }

      // Add student details in table format
      ctx.textAlign = 'left';
      ctx.font = 'bold 14px Arial';

      // Exam Center
      ctx.fillText("Exam Center Name :", 30, 200);
      ctx.font = '14px Arial';
      ctx.fillText(data.examCenterName, 170, 200);

      // College
      ctx.font = 'bold 14px Arial';
      ctx.fillText("College Name :", 30, 230);
      ctx.font = '14px Arial';
      ctx.fillText(data.collegeName, 170, 230);

      // Program
      ctx.font = 'bold 14px Arial';
      ctx.fillText("Program Name :", 30, 260);
      ctx.font = '14px Arial';
      ctx.fillText(data.programName, 170, 260);

      // Candidate Name
      ctx.font = 'bold 14px Arial';
      ctx.fillText("Candidate Name :", 30, 290);
      ctx.font = '14px Arial';
      ctx.fillText(data.candidateName, 170, 290);

      // Father's Name
      ctx.font = 'bold 14px Arial';
      ctx.fillText("Father's Name :", 30, 320);
      ctx.font = '14px Arial';
      ctx.fillText(data.fatherName, 170, 320);

      // Mother's Name
      ctx.font = 'bold 14px Arial';
      ctx.fillText("Mother's Name :", 30, 350);
      ctx.font = '14px Arial';
      ctx.fillText(data.motherName, 170, 350);

      // SECOND ROW OF DETAILS

      // Enrollment and Roll Number
      ctx.font = 'bold 14px Arial';
      ctx.fillText("Enrollment Number :", 30, 390);
      ctx.font = '14px Arial';
      ctx.fillText(data.enrollmentNumber, 170, 390);

      ctx.font = 'bold 14px Arial';
      ctx.fillText("Roll Number :", 330, 390);
      ctx.font = '14px Arial';
      ctx.fillText(data.rollNumber, 420, 390);

      ctx.font = 'bold 14px Arial';
      ctx.fillText("Exam Form Number", 615, 390);
      ctx.font = '14px Arial';
      ctx.fillText(data.examFormNumber, 650, 410);

      // Exam Category, Type, etc.
      ctx.font = 'bold 14px Arial';
      ctx.fillText("Exam Category :", 30, 420);
      ctx.font = '14px Arial';
      ctx.fillText(data.examCategory, 170, 420);

      ctx.font = 'bold 14px Arial';
      ctx.fillText("Exam Type :", 330, 420);
      ctx.font = '14px Arial';
      ctx.fillText(data.examType, 420, 420);

      // Category and Gender
      ctx.font = 'bold 14px Arial';
      ctx.fillText("Category :", 30, 450);
      ctx.font = '14px Arial';
      ctx.fillText(data.category, 170, 450);

      ctx.font = 'bold 14px Arial';
      ctx.fillText("Gender :", 330, 450);
      ctx.font = '14px Arial';
      ctx.fillText(data.gender, 420, 450);

      // Semester/Year
      ctx.font = 'bold 14px Arial';
      ctx.fillText("Semester / Year :", 30, 480);
      ctx.font = '14px Arial';
      ctx.fillText(data.semesterYear, 170, 480);

      // Draw subject table
      const tableX = 30;
      let tableY = 520;
      const tableWidth = canvas.width - 60;
      const rowHeight = 30;

      // Draw table headers
      ctx.fillStyle = '#b3d7ff';
      ctx.fillRect(tableX, tableY, tableWidth, rowHeight);

      // Add table borders
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(tableX, tableY, tableWidth, rowHeight);

      // Draw header dividers
      const paperColWidth = 100;
      const subjectColWidth = 150;

      ctx.beginPath();
      ctx.moveTo(tableX + paperColWidth, tableY);
      ctx.lineTo(tableX + paperColWidth, tableY + rowHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(tableX + paperColWidth + subjectColWidth, tableY);
      ctx.lineTo(tableX + paperColWidth + subjectColWidth, tableY + rowHeight);
      ctx.stroke();

      // Add header text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText("Paper . No.", tableX + paperColWidth/2, tableY + rowHeight/2 + 5);
      ctx.fillText("Subject", tableX + paperColWidth + subjectColWidth/2, tableY + rowHeight/2 + 5);
      ctx.fillText("Subject Name", tableX + paperColWidth + subjectColWidth + (tableWidth - paperColWidth - subjectColWidth)/2, tableY + rowHeight/2 + 5);

      // Draw subject rows
      tableY += rowHeight;

      if (data.subjects && data.subjects.length > 0) {
        data.subjects.forEach((subject: any, index: number) => {
          // Alternate row colors
          if (index % 2 === 0) {
            ctx.fillStyle = '#f2f2f2';
          } else {
            ctx.fillStyle = '#ffffff';
          }

          ctx.fillRect(tableX, tableY, tableWidth, rowHeight);

          // Add cell borders
          ctx.strokeRect(tableX, tableY, tableWidth, rowHeight);

          // Add column dividers
          ctx.beginPath();
          ctx.moveTo(tableX + paperColWidth, tableY);
          ctx.lineTo(tableX + paperColWidth, tableY + rowHeight);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(tableX + paperColWidth + subjectColWidth, tableY);
          ctx.lineTo(tableX + paperColWidth + subjectColWidth, tableY + rowHeight);
          ctx.stroke();

          // Add cell text
          ctx.fillStyle = '#000000';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(subject.paperNo, tableX + paperColWidth/2, tableY + rowHeight/2 + 5);
          ctx.fillText(subject.subject, tableX + paperColWidth + subjectColWidth/2, tableY + rowHeight/2 + 5);

          // Subject name might be long, so let's handle it differently
          ctx.textAlign = 'left';
          ctx.fillText(subject.subjectName, tableX + paperColWidth + subjectColWidth + 10, tableY + rowHeight/2 + 5);

          tableY += rowHeight;
        });
      }

      // Add note section
      tableY += 40;  // Increased spacing before Note section
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText("Note", 30, tableY);

      tableY += 25;  // Adjusted spacing after Note heading
      ctx.font = '12px Arial';
      ctx.fillText("आपके द्वारा परीक्षा फार्म में दिए गए अर्हता विवरण की जाचोपरांत कोई अनियमितता या कूटरचित तथ्य तथा", 30, tableY);
      
      tableY += 20;
      ctx.fillText("प्रवेशित (काउंसलिंग, विश्वविद्यालय) के निर्देशों के विपरीत पाए जाने पर परीक्षाफल निरस्त कर दिया जाएगा।", 30, tableY);

      tableY += 25;  // Increased spacing between Hindi and English text
      ctx.fillText("Students failing to bring this Admit Card along with a valid Government issued photo", 30, tableY);

      tableY += 20;
      ctx.fillText("identity proof shall not be allowed to appear in the examination. This Admit Card is", 30, tableY);

      tableY += 20;
      ctx.fillText("provisional - The result shall be declared subject to eligibility of the candidate", 30, tableY);

      // Add controller signature
      try {
        let controllerSignImg;
        try {
          controllerSignImg = await loadImage('/src/assets/images/controller_of_examination_signature.svg');
        } catch (err) {
          console.log('Could not load controller signature, using student signature as fallback');
          controllerSignImg = await loadImage(data.studentSignature);
        }

        // Adjusted position and size of controller signature to maintain proportions
        ctx.drawImage(controllerSignImg, canvas.width - 200, tableY - 20, 180, 60);

        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("Controller Of Examination", canvas.width - 110, tableY + 60);
      } catch (error) {
        console.error('Could not load controller signature:', error);
      }

      // Add instructions for candidates
      tableY += 80;  // Adjusted spacing after controller signature
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText("अभ्यर्थियों के लिए आवश्यक निर्देश", canvas.width / 6.2, tableY);

      tableY += 30;  // Adjusted spacing after instructions heading
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText("1. अभ्यर्थी को परीक्षा केंद्र मेश प्रवेश पत्र के साथ भारत सरकार द्वारा जारी फोटो पहचान पत्र लाना अनिवार्य है।", 30, tableY);

      tableY += 25;  // Adjusted spacing between instructions
      ctx.fillText("2. उत्तर पुस्तिका पर अपने अनुक्रमांक निम्न्वतलिखें - अनुक्रमांक ( अंकों में)", 30, tableY);

      // Add roll number at bottom
      tableY += 30;
      ctx.font = 'bold 14px Arial';
      ctx.fillText(data.rollNumber, canvas.width / 2.2, tableY -18);  // Changed from +20 to +16

      // Add date and time
      tableY += 40;
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText("Print Date & Time :", 30, tableY);

      const formattedDateTime = getCurrentDateTime();
      ctx.fillText(formattedDateTime, 150, tableY);

      // Convert canvas to image data URL
      const dataUrl = canvas.toDataURL('image/png');
      setDownloadUrl(dataUrl);

    } catch (error) {
      console.error('Error generating admit card:', error);
      uiToast({
        title: 'Error',
        description: 'Error generating admit card preview.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // To handle CORS issues

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

      // Set source after setting event handlers
      img.src = src;
    });
  };

  const handleDownload = () => {
    if (downloadUrl) {
      downloadAsImage(downloadUrl, `${data.candidateName}_admit_card.png`);
    } else {
      toast({
        title: 'Error',
        description: 'No preview available to download',
        variant: 'destructive',
      });
    }
  };

  const handlePrint = () => {
    if (!downloadUrl) {
      uiToast({
        title: 'Error',
        description: 'No preview available to print',
        variant: 'destructive',
      });
      return;
    }

    // Create a printable window with the image
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      uiToast({
        title: 'Error',
        description: 'Please allow popups to print the admit card',
        variant: 'destructive',
      });
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${data.candidateName} - Admit Card</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; }
            img { max-width: 100%; height: auto; }
            @media print {
              img { width: 100%; }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <img src="${downloadUrl}" alt="Admit Card" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePDFDownload = () => {
    if (downloadUrl) {
      downloadAsPDF(downloadUrl, `${data.candidateName}_admit_card.pdf`);
    } else {
      toast({
        title: 'Error',
        description: 'No preview available to download as PDF',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Admit Card Preview</h3>
          <div className="flex gap-2">
            {downloadUrl && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload} 
                  className="flex gap-1"
                >
                  <Download className="h-4 w-4" /> PNG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePDFDownload} 
                  className="flex gap-1"
                >
                  <Download className="h-4 w-4" /> PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrint} 
                  className="flex gap-1"
                >
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </>
            )}
            {!downloadUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generatePreview}
              >
                Generate Preview
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 relative flex items-center justify-center" ref={containerRef}>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center">
              <Spinner size="lg" />
              <p className="mt-2 text-sm text-muted-foreground">Generating preview...</p>
            </div>
          ) : downloadUrl ? (
            <img 
              src={downloadUrl} 
              alt="Admit Card Preview" 
              className="max-w-full max-h-full object-contain shadow-lg"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No preview available</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={generatePreview}
              >
                Generate Preview
              </Button>
            </div>
          )}
        </div>
        <div className="hidden">
          <canvas 
            ref={canvasRef} 
            className="admit-card-canvas"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdmitCardPreview;