
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

// Function to get the current date and time in a formatted string
export const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: '2-digit' 
  });
  const time = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
  return `${date}    ${time}`;
};

// Function to download content as image
export const downloadAsImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to download content as PDF
export const downloadAsPDF = (dataUrl: string, filename: string) => {
  const img = new Image();
  img.src = dataUrl;
  
  img.onload = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  };
};
