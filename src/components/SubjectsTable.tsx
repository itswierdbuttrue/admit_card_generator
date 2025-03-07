
import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Subject {
  id: string;
  paperNo: string;
  subject: string;
  subjectName: string;
}

interface SubjectsTableProps {
  subjects: Subject[];
  onChange: (subjects: Subject[]) => void;
}

const SubjectsTable: React.FC<SubjectsTableProps> = ({ subjects, onChange }) => {
  const [tableData, setTableData] = useState<Subject[]>(subjects);

  useEffect(() => {
    setTableData(subjects);
  }, [subjects]);

  const handleAddRow = () => {
    const newRow: Subject = {
      id: `subject-${Date.now()}`,
      paperNo: `Paper - ${tableData.length + 1}`,
      subject: '',
      subjectName: '',
    };
    
    const newData = [...tableData, newRow];
    setTableData(newData);
    onChange(newData);
  };

  const handleRemoveRow = (id: string) => {
    if (tableData.length <= 1) return;
    
    const newData = tableData.filter(row => row.id !== id);
    setTableData(newData);
    onChange(newData);
  };

  const handleCellChange = (id: string, field: keyof Subject, value: string) => {
    const newData = tableData.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    
    setTableData(newData);
    onChange(newData);
  };

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="subjects-table">
        <thead>
          <tr>
            <th className="w-24">Paper No.</th>
            <th className="w-32">Subject</th>
            <th>Subject Name</th>
            <th className="w-16 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="text"
                  value={row.paperNo}
                  onChange={(e) => handleCellChange(row.id, 'paperNo', e.target.value)}
                  placeholder="Paper No."
                  className="input-cell"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.subject}
                  onChange={(e) => handleCellChange(row.id, 'subject', e.target.value)}
                  placeholder="Subject"
                  className="input-cell"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.subjectName}
                  onChange={(e) => handleCellChange(row.id, 'subjectName', e.target.value)}
                  placeholder="Subject Name"
                  className="input-cell"
                />
              </td>
              <td className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => handleRemoveRow(row.id)}
                >
                  <Minus size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-2 flex justify-end bg-muted/30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={handleAddRow}
        >
          <Plus size={14} className="mr-1" /> Add Row
        </Button>
      </div>
    </div>
  );
};

export default SubjectsTable;
