import {Router} from 'express';
import {startOfHour, parseISO} from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (req, res) => {
    const appointments = appointmentsRepository.all();

    return res.json(appointments);
});

appointmentsRouter.post('/', (req, res) => {
    const {provider, date} = req.body;

    const parseDate = startOfHour(parseISO(date));

    const findAppointmentInSameDate = appointmentsRepository.findByDate(
        parseDate,
    );

    if(findAppointmentInSameDate){
        return res.status(400).json({msg: 'This appointment is already booked.'});
    }

    const appointment = appointmentsRepository.create({
        provider,
        date: parseDate,
    });

    return res.json(appointment);
});

export default appointmentsRouter;