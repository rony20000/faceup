import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CheckBox from './';

describe('CheckBox component', () => {
    it('renders a checkbox with the correct label', () => {
        const labelText = 'Check me';
        const { getByLabelText } = render(<CheckBox label={labelText} />);
        const checkbox = getByLabelText(labelText);

        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    it('handles onChange event correctly', () => {
        const handleChange = jest.fn();
        const labelText = 'Check me';
        const { getByLabelText } = render(<CheckBox label={labelText} onChange={handleChange} />);
        const checkbox = getByLabelText(labelText);

        fireEvent.click(checkbox);

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('renders with defaultChecked prop correctly', () => {
        const labelText = 'Check me';
        const { getByLabelText } = render(<CheckBox label={labelText} defaultChecked />);
        const checkbox = getByLabelText(labelText);

        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();
    });
});
