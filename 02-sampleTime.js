import test from 'ava';
import Rx from 'rxjs/Rx';

function getCountdownObservable(
    player$,
    interval = 1000
) {
    const maxTimeIsAvailable = event => event.maxTime && event.maxTime > 0;
    const getTimeToEnd = event => Math.floor(event.maxTime - event.currentTime);

    return player$
        .sampleTime(interval)
        .filter(maxTimeIsAvailable)
        .map(getTimeToEnd);
}

function emitsArrayValuesAtInterval(arrayToEmit, interval) {
    return Rx.Observable
        .zip(
            Rx.Observable.from(arrayToEmit),
            Rx.Observable.timer(0, interval),
            item => item
        )
}

test('02 sample time', t => {
    const values = [
        { currentTime: 0, maxTime: null},
        { currentTime: 0, maxTime: 10},
        { currentTime: 1, maxTime: 10},
        { currentTime: 2, maxTime: 10},
    ];

    const mockPlayer$ = emitsArrayValuesAtInterval(values, 1000);

    const countdown$ = getCountdownObservable(mockPlayer$);

    const expected = [10, 9];

    return countdown$
        .bufferCount(100)
        .map(
            x => t.deepEqual(expected, x)
        );
});