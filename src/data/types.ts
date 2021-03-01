export class PostType {
  constructor(
    public date: String,
    public slug: String,
    public title: String,
    public description: String,
    public body: String,
    public featuredImage: String,
    public tags: [String],
    public section: [String],
    public likeLevel = 0,
    public contentType: String
  ) {}
}
