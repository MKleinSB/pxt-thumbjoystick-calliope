// original forked from https://github.com/Microbit-Grove-Library/pxt-OledDisplay
// MIT License
// Changes for Calliope Mini by M.Klein 16.04.19

enum GroveJoystickPins {
    //% block=P1
    P1 = 7,
    //% block=P2
    P2 = 8,
    //% block=C16
    C16 = 9,
    //% block=C17
    C17 = 15
}

enum GroveJoystickKey {
    //% block=None
    None = 0,
    //% block=Up
    Up = 1,
    //% block=Down
    Down = 2,
    //% block=Left
    Left = 3,
    //% block=Right
    Right = 4,
    //% block=UpperLeft
    UL = 5,
    //% block=LowerLeft
    LL = 6,
    //% block=UpperRight
    UR = 7,
    //% block=LowerRight
    LR = 8,
    //% block=Press
    Press = 9
}

/**
 * Functions to operate Grove module.
 */
//% weight=10 color=#9F79EE icon="\uf108" block="Grove - Thumb JoyStick"
namespace grovejoystick {
    const joystickEventID = 3101;
    let lastJoystick = GroveJoystickKey.None;
    let joystick: GroveJoystick = undefined;

    /**
     * Do something when a key is detected by Grove - Thumb Joystick
     * @param key type of joystick to detect
     * @param xpin, eg: GroveJoystickPins.C16
     * @param ypin, eg: GroveJoystickPins.C17
     * @param handler code to run
     */
    //% blockId=grove_joystick_create_event block="on Key|%key| at x pin|%xpin| and y pin|%ypin|"
    export function onJoystick(key: GroveJoystickKey, xpin: GroveJoystickPins, ypin: GroveJoystickPins, handler: () => void) {
        control.onEvent(joystickEventID, key, handler);
        control.inBackground(() => {
            while (true) {
                const key = joystick.read(xpin, ypin);
                if (key != lastJoystick) {
                    lastJoystick = key;
                    control.raiseEvent(joystickEventID, lastJoystick);
                }
                basic.pause(200);
            }
        })

    }


    export class GroveJoystick {
        /**
         * Detect position from Grove - Thumb Joystick
         * @param xpin Calliope Mini Pin connected to Grove - Thumb Joystick x pin
         * @param ypin Calliope Mini Pin connected to Grove - Thumb Joystick y pin
         */
        //% blockId=grove_joystick_read block="%joystick|Read key of joystickon at|%xpin|and|%ypin"
        //% advanced=true
        read(xpin: GroveJoystickPins, ypin: GroveJoystickPins): number {
            let xdata = 0, ydata = 0, result = 0;
            let x: number = xpin;
            let y: number = ypin;

            xdata = pins.analogReadPin(<AnalogPin>x);
            ydata = pins.analogReadPin(<AnalogPin>y);
            if (xdata > 1000) {
                result = GroveJoystickKey.Press;
            }
            else if (xdata > 600) {
                if (ydata > 600) result = GroveJoystickKey.UR;
                else if (ydata < 400) result = GroveJoystickKey.LR;
                else result = GroveJoystickKey.Right;
            }
            else if (xdata < 400) {
                if (ydata > 600) result = GroveJoystickKey.UL;
                else if (ydata < 400) result = GroveJoystickKey.LL;
                else result = GroveJoystickKey.Left;
            }
            else {
                if (ydata > 600) result = GroveJoystickKey.Up;
                else if (ydata < 400) result = GroveJoystickKey.Down;
                else result = GroveJoystickKey.None;
            }

            return result;
        }
    }
} 
