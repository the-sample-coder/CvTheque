import React, { useState } from 'react';
import { format } from 'date-fns';
import CvSearch from './cv-search'; 
import CvTable from './cv-table';   

const CvSearchAndTable = (props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value.toLowerCase());
  };

  // Filtrez les CV en fonction du terme de recherche
  const filteredCvs = props.items.filter(
    (cv) =>
      cv.name.toLowerCase().includes(searchTerm) ||
      format(cv.createdAt, 'dd/MM/yyyy').includes(searchTerm)
  );

  return (
    <div>
      <CvSearch onChange={handleSearch} />
      <CvTable items={filteredCvs} {...props} />
    </div>
  );
};

export default CvSearchAndTable;
