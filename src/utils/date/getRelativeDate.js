import { formatDistanceToNowStrict } from "date-fns";
import { fr } from 'date-fns/locale'

export function getRelativeDate(date) {
    return formatDistanceToNowStrict(
        date, 
        { addSuffix: true, locale: fr,}
    );
}