import mongoose, { Schema } from 'mongoose';

const pageSchema = new Schema({}, { strict: false, collection: 'pages' });

/**
 * We use an empty schema with strict: false so it can query any valid JSON 
 * structure saved from the builder, straight from the "pages" collection.
 */
export const PageModel = mongoose.models.Page || mongoose.model('Page', pageSchema);
