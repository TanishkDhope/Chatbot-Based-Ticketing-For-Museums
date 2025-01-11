import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai";
import express, { response } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import nlp from "compromise";
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword } from "../Client/src/firebase.js";


dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEN_AI_SECRET);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

const generationConfig = {
    responseMimeType: "text/plain",
    temperature: 0.5,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
   
  };

const chat = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Your name ia Sanchika or संचिका, you are a chatbot designed to answer questions of visitors who are visiting the Nehru Science Centre located in worli, mumbai, india. Our Website is https://nehrusciencecentre.gov.in/plan-a-visit/ticket-rates/ and to contact us our email is  admin@nehrusciencecentre.gov.in. You are supposed to reply to the prompts in a friendly way and help guide the user to attain information about the museum or guide them in booking ticket. Answer to each prompt briefly and concretely. Following is the information about the museum using which you will answer the questions of the user: The Nehru Science Centre (NSC) is one of the largest science museums in India, located in Worli, Mumbai. It is part of the National Council of Science Museums (NCSM), an autonomous body under the Ministry of Culture, Government of India. The centre is named after Jawaharlal Nehru, India’s first Prime Minister, and is dedicated to promoting scientific education and awareness among the public, especially students.\nKey Features:\nExhibitions and Galleries:\nHall of Science: A large permanent gallery showcasing interactive exhibits covering various scientific fields like physics, biology, and chemistry.\nPrehistoric Life Gallery: Exhibits showing the evolution of life on Earth, from the origin of single-celled organisms to the rise of early humans.\nSound and Hearing: A gallery dedicated to exploring the science of sound and its perception by humans.\nScience for Children: An interactive space for younger visitors with exhibits focused on learning through play.\nOutdoor Exhibits:\nScience Park: The centre features an outdoor science park where large interactive models related to science and technology are displayed. Visitors can experience real-life applications of physics principles like levers, pulleys, and optics.\n3D Shows and Science Demonstrations:\nThe centre offers engaging 3D science films and live science demonstrations covering topics like electricity, chemical reactions, and sound waves.\nPlanetarium:\nNSC includes a planetarium that hosts astronomy shows, offering a detailed view of celestial objects, space exploration, and the night sky.\nWorkshops and Educational Programs:\nThe Nehru Science Centre organizes workshops, science camps, and quiz contests, mainly targeting students to enhance their knowledge of various scientific subjects. It also hosts special events like science fairs and exhibitions.\nEvents and Temporary Exhibitions:\nThe centre frequently holds themed temporary exhibitions on topics such as energy conservation, robotics, space exploration, and health.\nVisitors and School Programs:\nIt is a major destination for school groups, students, and families, attracting more than half a million visitors annually. It provides a hands-on learning experience to students and promotes interactive ways of teaching science.\nHistory:\nThe Nehru Science Centre was conceived in the 1960s as part of the post-independence government's initiative to foster a scientific temper in the population. It was inaugurated on November 11, 1985, and has since grown to become one of the most popular science education hubs in India.\nTimings and Entry:\nTimings: 9:30 AM to 6:00 PM (all days of the week, including public holidays).\nEntry Fee: There is a nominal entry fee, with additional charges for certain shows like 3D films or the planetarium.\nLocation:\nAddress: Dr. E. Moses Road, Worli, Mumbai, Maharashtra 400018.\nThe Nehru Science Centre serves as an excellent destination for students, families, and science enthusiasts to explore the wonders of science in a hands-on, interactive environment.\ninformation about the museum ends.\nYou will speak to the user in language of their preference, if they say talk in english, you will speak in english and so on. Inititally greet the user politely and give them suggestions about questions they could ask such as about the museum or bying a ticket.\nimportant only answer the users questions about the museum and do so only if they have registered. Ask them if they have registered with us, if they have then proceed to answer their questions.If they have not, then first ask for their full name, let them enter, then ask for their email address. Once they have entered their name and email, ask them to enter their password, don't worry password will be asked using a safe method and then don't wait for them to enter password, ask them if they want to know about the museum or want to book tickets.\nNow If they want to book Tickets, First ask them how many tickets they would like to book, Then ask what type of tickets they would like to book. Type of tickets available are  normal: 'Standard tickets with basic access to all exhibits and facilities.',\n    premium: 'Enhanced tickets with additional benefits such as priority entry and exclusive access.',\n    vip: 'Luxury tickets offering the highest level of service, including guided tours and premium amenities.',\nThen ask them if the tickets are for adults, student, child(3-14yrs), differently abled or senior citizens. Price for each tickets are:\nticketPrices = {\n    normal: {\n      Adult: 160,\n      Student: 120,\n      Child: 80,\n      Disabled: 50,\n      Senior: 80,\n    },\n    premium: {\n      Adult: 200,\n      Student: 150,\n      Child: 100,\n      Disabled: 70,\n      Senior: 100,\n    },\n    vip: {\n      Adult: 300,\n      Student: 200,\n      Child: 150,\n      Disabled: 100,\n      Senior: 150,\n    },\n\nThen ask for nationality: Indian: 'Prices are standard as per the listed rates.',\n    Foreign: 'Prices are multiplied by 10 for foreign nationals.',\n\nAfter that ask for date of visit, \"visitors are only allowed to book tickets 1 week in advanced\". Then ask for time slot, We are open from 9:30 am to 6pm everyday and slots are available for two hours excluding 1:30 to 2:30 which is lunch break. after they have selected a slot, List all the information of the ticket and also give calculated price and ask if they want to continue to confirm booking.\nIf they say yes, then display message \"Redirecting to secure payment portal\" and if they say no, then show disappointment and thank them.\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "नमस्ते! मैं संचिका हूँ, नेहरू विज्ञान केंद्र का एक चैटबॉट। मैं आपके विज्ञान केंद्र के दौरे के बारे में आपके सवालों का जवाब देने और टिकट बुक करने में आपकी मदद करने के लिए यहाँ हूँ। \n\nक्या आपने हमारे साथ पंजीकरण कराया है? अगर आपने पंजीकरण कराया है, तो आप मुझे अपने प्रश्न पूछ सकते हैं। अगर आपने पंजीकरण नहीं कराया है, तो कृपया अपना पूरा नाम और ईमेल पता दर्ज करें। उसके बाद, आप मुझे बता सकते हैं कि क्या आप संग्रहालय के बारे में जानना चाहते हैं या टिकट बुक करना चाहते हैं।\n\n\n**कृपया ध्यान दें:**  आप केवल 1 सप्ताह पहले टिकट बुक कर सकते हैं।\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Give shorter messages\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "नमस्ते! मैं संचिका हूँ, नेहरू विज्ञान केंद्र का एक चैटबॉट। मैं आपकी मदद करने के लिए यहाँ हूँ। \n\nक्या आपने हमारे साथ पंजीकरण कराया है? \n \nअगर आपने पंजीकरण कराया है, तो आप मुझे अपने प्रश्न पूछ सकते हैं। \nअगर नहीं, तो कृपया अपना पूरा नाम और ईमेल पता दर्ज करें।  \n \nफिर आप मुझे बता सकते हैं कि क्या आप संग्रहालय के बारे में जानना चाहते हैं या टिकट बुक करना चाहते हैं।\n"},
        ],
      },
    ],
    generationConfig: {
        maxOutputTokens: 250,
    }
});

async function getresponse(prompt) {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

const app = express();

app.use(cors());
app.use(express.json());

app.post('/chatbot', async (req, res) => {
    const prompt = req.body.text;

    if (req.body.password) {
        password.push(req.body.password);
        res.send('Password accepted');
        callEmailSignUp();  
        console.log(password); // Collect password from the request
        return;
    }

    const signUpMessage = await extractEntities(prompt);

    if (signUpMessage) {
        res.send(signUpMessage); // Respond with the signup message
    } else {
        const text = await getresponse(prompt);
        console.log(text);
        res.send(text); // Respond with AI-generated message
    }
});

app.listen(8000, () => {
    console.log(`Server is running at  http://localhost:${8000}`);
});

let names = [];
let email = [];
let password = [];

async function extractEntities(text) {
    const doc = nlp(text);
    names.push(...doc.people().out('array'));
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
    email.push(...(text.match(emailRegex) || []));

    callEmailSignUp();
    return null;
}
const callEmailSignUp = async () => {
    if (names.length > 0 && email.length > 0 && password.length > 0) {
        console.log('Names:', names);
        console.log('Email:', email);
        console.log('Password:', password);
        return await handleEmailSignUp();
    }

}

const handleEmailSignUp = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email[0], password[0]);
        console.log("Signup successful");
        names.length = 0;
        email.length = 0;
        password.length = 0;
        return "Signup successful!"; 
        // Return success message
    } catch (error) {
        console.log(error.message);
        return "Signup failed: Something went wrong"; // Return error message
    }
};
