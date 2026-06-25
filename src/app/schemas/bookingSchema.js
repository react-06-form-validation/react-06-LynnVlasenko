import { z } from 'zod';
//import * as z from "zod";
/**
 * Builds the Zod schema for the booking form.
 *
 * TODO: implement the validation rules described in README.md → "Form Fields & Validation Rules":
 *  - bookerName: string, required, min 2 characters
 *  - bookerEmail: string, optional, must be a valid email when provided (empty string is allowed)
 *  - eventName: string, required, min 2 characters
 *  - eventDate: required, must be a future date
 *  - numberOfGuests: number, required, integer, min 1, max 10
 *  - timeSlot: string, required, must be one of `availableTimeSlots`
 *  - eventLink: string, required, must be a valid URL
 *
 * @param {string[]} availableTimeSlots - time slots fetched from `/api/time-slots`
 */
export const createBookingSchema = (availableTimeSlots = []) =>
  z.object({
    // + TODO: define field validations here
    bookerName: z.string()
      .trim()
      .min(1, "Name is required")
      .min(2, "Booker name must be at least 2 characters long")
      .regex(/^[A-Za-zА-Яа-яЇїІіЄєҐґ'’\- ]+$/, "Letters, apostrophes, and hyphens only"),
    
    bookerEmail: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.email('Invalid email address').optional()
    ),
    
    eventName: z.string()
      .trim()
      .min(1, "Event name is required")
      .min(2, "Event name must be at least 2 characters long")
      .regex(/^[A-Za-zА-Яа-яЇїІіЄєҐґ'’\- ]+$/, "Letters, apostrophes, and hyphens only"),
    
    
    eventDate: z.preprocess(
      (v) => {
        if (v instanceof Date) return v;
        if (typeof v === 'string' && v !== '') return new Date(v);
        return v;
      },
      z.date()
      .refine((date) => date > new Date(), { message: 'Event date must be in the future' })
    ),
    
    numberOfGuests: z.preprocess(
      (v) => {
        if (typeof v === 'string' && v !== '') return Number(v);
        return v;
      },
      z.number()
      .int()
      .gte(1, { message: 'Number of Guests must be greater than or equal to 1' })
      .lte(10, { message: 'Number of Guests must be less than or equal to 10' })
    ),

    timeSlot: z.enum(availableTimeSlots, { message: 'Selected time slot is unavailable' }),
    
    eventLink:
      z.string().url('Invalid URL. Please enter a valid event link')
  });