import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const CvTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    onImport,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const [cvs, setCvs] = useState([]); // State to store the list of CVs
  const jwtToken = sessionStorage.getItem('jwt');

  useEffect(() => {
    const apiUrl = 'http://localhost:8082/file/list';
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        console.log('Données CV récupérées :', response.data); // Vérifiez les données récupérées dans la console
        setCvs(response.data); // Met à jour le state avec les données récupérées
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des CVs :', error);
      });
  }, []);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Cv Name</TableCell>
                <TableCell>Date de Creation</TableCell>
                <TableCell>Pourcentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cvs.map((cv) => {
                const isSelected = selected.includes(cv.id);
                return (
                  <TableRow hover key={cv.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(cv.id);
                          } else {
                            onDeselectOne?.(cv.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {cv.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {cv.creationDate
                        ? format(new Date(cv.creationDate), 'dd/MM/yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>Null</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CvTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};