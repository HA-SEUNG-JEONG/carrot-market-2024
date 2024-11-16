export function formatToWon(price: number) {
    return price.toLocaleString("ko-KR") + "원";
}

export function formatToDate(date: string) {
    const dayInMs = 1000 * 60 * 60 * 24;
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((time - now) / dayInMs);

    const formatter = new Intl.RelativeTimeFormat("ko");
    return formatter.format(diff, "days");
}
