import express from 'express';
import { eventModel } from '../model/model.js'; // Ensure this path is correct for your eventModel

const router = express.Router();

// GET route to display details for a specific event
router.get('/:id', async (req, res) => {
    try {
        const eventId = req.params.id; // Get the event ID from the URL parameter

        // Check if eventId is a valid ObjectId format if you're using MongoDB
        // This prevents Mongoose from throwing a CastError for malformed IDs
        if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).render('error', {
                title: 'Event Not Found',
                user: req.session.user,
                message: 'Invalid Event ID format.'
            });
        }

        const event = await eventModel.findById(eventId); // Find the event by its ID

        if (!event) {
            // If no event is found with that ID, render a 404 page
            return res.status(404).render('error', {
                title: 'Event Not Found',
                user: req.session.user,
                message: 'The event you are looking for does not exist.'
            });
        }

        // Render the viewevents.hbs template with the event data
        res.render('viewevents', {
            title: event.title, // Use the event title for the page title
            user: req.session.user,
            event: event,       // Pass the fetched event object to the template
            message: req.query.message, // To display success messages
            // Format dates for display
            formattedStartDate: event.date_start ? new Date(event.date_start).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
            formattedEndDate: event.date_end ? new Date(event.date_end).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
            pageCss: 'viewevents.css' // Link specific CSS for this page
        });

    } catch (error) {
        console.error('Error fetching event details:', error);
        // If there's a server error, render a generic error or 404
        res.status(500).render('error', {
            title: 'Error',
            user: req.session.user,
            message: 'An internal error occurred while fetching event details.'
        });
    }
});

export default router;