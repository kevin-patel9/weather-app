export const dateConversion = () => {
    const date = new Date();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Extract the day, month, and weekday
    const day = date.getUTCDate();
    const month = monthNames[date.getUTCMonth()];
    const weekday = weekdayNames[date.getUTCDay()];

    // Format the date string
    const formattedDate = `${day} ${month} ${weekday}`;

    return formattedDate;
}

export const dayTime = () => {
    const fullDayTime = [];
    const currentHour = new Date().getHours();

    for (let i = 0; i < 24; i++) {
        const hour = (currentHour + i) % 24; // Adjust hour for 24-hour loop
        const twelveHourFormat = hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
        const timeFormat = hour < 12 ? "am" : "pm";

        fullDayTime.push(`${twelveHourFormat} ${timeFormat}`);
    }

    return fullDayTime;
};

