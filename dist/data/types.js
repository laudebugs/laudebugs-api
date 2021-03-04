"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostType = void 0;
class PostType {
    constructor(date, slug, title, description, body, featuredImage, tags, section, likeLevel = 0, contentType) {
        this.date = date;
        this.slug = slug;
        this.title = title;
        this.description = description;
        this.body = body;
        this.featuredImage = featuredImage;
        this.tags = tags;
        this.section = section;
        this.likeLevel = likeLevel;
        this.contentType = contentType;
    }
}
exports.PostType = PostType;
//# sourceMappingURL=types.js.map