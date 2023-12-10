/**
 * Generate the gauge's colour for temperature
 * @param temp The temperature in celcius
 * @returns A colour
 */
export function generateTempColour(temp: number) {
    if (temp <= -10) return '#4D8FF7';
    else if (temp > -10 && temp <= 5) return '#28BCE4';
    else if (temp > 5 && temp <= 15) return '#0BBE53';
    else if (temp > 15 && temp <= 25) return '#ecec37';
    else if (temp > 25) return '#FF3233';
}

/**
 * Generates the status of a temperature, if it is getting too hot or is hot!
 * @param temp The temperature in celcius
 * @returns "Danger!", "Warning!", "All Good!"
 */
export function tempStatus(temp: number) {
    return temp > 25
        ? 'Danger!'
        : temp >= 15 && temp <= 25
          ? 'Warning!'
          : 'All Good!';
}
