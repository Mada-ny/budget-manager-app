export function buildDateTime(date, time) {
    const result = new Date(date);

    if (!time) {
        result.setHours(0, 0, 0, 0);
        return result;
    }

    const [h = "0", m = "0"] = time.split(":");
    result.setHours(Number(h), Number(m), 0, 0);
    
    return result;
}