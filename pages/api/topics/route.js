import connectMongoDB from "../../../libs/mongodb";
import Topic from "../../../models/topic";
import { NextResponse } from "next/server";

export default async function POST(request) {
    console.log("Request received:", request);
    const {levelNumber, levelId, levelName, completionType, finishCriteria, text} = await request.json();
    console.log("Request body:", { levelNumber, levelId, levelName, completionType, finishCriteria, text });
    await connectMongoDB();
    await Topic.create({levelNumber, levelId, levelName, completionType, finishCriteria, text});
    console.log("Level created");
    return NextResponse.json({message: "Level created"}, {status: 201})
}