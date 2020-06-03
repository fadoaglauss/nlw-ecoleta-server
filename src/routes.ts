import express, { request, response } from 'express';
import knex from './database/connection'

const routes = express.Router();

routes.get('/items', async (request, response) => {
    const items = await knex('items').select('*');
    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3000/public/images/${item.image}`
        }
    });
    return response.json(serializedItems);
});

routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = request.body;

    const trx = await knex.transaction();

    const insertedIds = await trx('points').insert({
        name,
        image: 'image-fake',
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    });    
    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
        return {
            item_id,
            point_id
        }
    });

    await trx('point_items').insert(pointItems);

    return response.json({ sucess: true })
})

export default routes;