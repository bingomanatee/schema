
export const ABSENT = Symbol('absent');

export const isAbsent = (item = ABSENT) => item === ABSENT;
