
import { useForm, Controller } from 'react-hook-form';
import { OutlinedInput, InputLabel, MenuItem, FormControl, Select, Typography } from '@mui/material';

export default function DropDownControl({name, label, data, errors, controls, multiple=false, readonly}){
    return(
        <FormControl fullWidth error={!!errors[name]}>
            <InputLabel id={`${name}-label`} >{label}</InputLabel>
            <Controller
                name={name}
                control={controls}
                rules={{ required: `${label} is required`}}
                render={({ field }) => (
                <Select
                    {...field}
                    labelId={`${name}-label`}
                    id={name}
                    input={<OutlinedInput label={label} readOnly={readonly} />}
                    multiple={multiple}
                >
                    {data.map((st) => (
                    <MenuItem key={st} value={st}>
                        {st}
                    </MenuItem>
                    ))}
                </Select>
                )}
            />
            {errors[name] && (
                <Typography sx={{ color: 'error.main', fontSize: "12px" }}>
                    {errors[name].message}
                </Typography>
            )}
        </FormControl>
    )
}