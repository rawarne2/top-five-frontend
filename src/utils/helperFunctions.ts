export const convertHeightToCm = (feet: number, inches: number): number => {
    return Math.round((feet * 30.48) + (inches * 2.54));
};

export const convertCmToFeetInches = (cm: number | null): { feet: number; inches: number } => {
    if (!cm) return { feet: 5, inches: 0 };
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
};