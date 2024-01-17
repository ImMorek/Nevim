import mongoose, {Schema} from "mongoose";

const topicSchema = new Schema(
    {
        levelNumber: Number,
        levelId: String,
        levelName: String,
        completionType: String, 
        finishCriteria: Array,
        text: String
    }
)

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default Topic;