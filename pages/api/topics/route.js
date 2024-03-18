import connectMongoDB from "../../../libs/mongodb";
import Topic from "../../../models/topic";
import { NextResponse } from "next/server";

export default async function POST(request) {
    const {levelNumber, levelId, levelName, completionType, finishCriteria, text} = await request.json();
    await connectMongoDB();
    await Topic.create({levelNumber, levelId, levelName, completionType, finishCriteria, text});
    return NextResponse.json({message: "Level created"}, {status: 201})
}