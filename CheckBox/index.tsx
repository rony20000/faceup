import { SxProps } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export interface SizeCheckboxesProps {
  sx?: SxProps;
  id?: string;
  label?: string;
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  isChecked?: boolean;
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'default';
}

export default function CheckBox({
  label,
  sx,
  defaultChecked,
  onChange,
  id,
  color = 'info',
  isChecked,
  ...props
}: SizeCheckboxesProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };
  return (
    <FormControlLabel
      id={id}
      checked={isChecked}
      value={label}
      control={<Checkbox color={color} defaultChecked={defaultChecked} onChange={handleChange} />}
      label={label}
      labelPlacement="end"
      sx={sx || { minWidth: 'fit-content', width: 'fit-content', minHeight: 'fit-content'}}
      {...props}
    />
  );
}
