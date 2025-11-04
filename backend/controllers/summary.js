import Summary from '../models/summary.js';
import Article from '../models/article.js';
import summariser from '../helper/summariser.js';
export const createSummary= async (req,res)=>{
    try{
        //make the summary block-->
        const {title, summaryText}=req.body;
        let actualsummary=await summariser(summaryText);

        const summary=new Summary({
            title,
            summaryText:actualsummary, //here it will call the another function which returns the summary for the time being keep it as it is!
            user:req.userId,
            summaryLength: actualsummary.split(' ').length
        });
        await summary.save();

        const article=new Article({
            title,
            content: summaryText,
            author:req.userId,
            summary:summary._id
        });
        await article.save();

        res.status(201).json({message:"Summary created successfully", summary, article});
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

// Get all summaries for the logged-in user  (may be used to display on the dashboard(need to add the articles too (like a pair of articels and summaries)))
export const getSummaries = async (req, res) => {
    try {
        const summaries = await Summary.find({ user: req.userId })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(summaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get a single summary by ID
export const getSummaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const summary = await Summary.findById(id)
            .populate('user', 'username email');

        if (!summary) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        // Check if user owns this summary
        if (summary.user._id.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to view this summary' });
        }

        res.status(200).json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update a summary
export const updateSummary = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summaryText } = req.body;

        const summary = await Summary.findById(id);
        if (!summary) {
            console.log("Summary not found");
            return res.status(404).json({ error: 'Summary not found' });
        }

        // Check if user owns this summary
        if (summary.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to update this summary' });
        }

        // Update fields
        if (title) summary.title = title;
        if (summaryText) summary.summaryText = summaryText;
        summary.updatedAt = Date.now();

        await summary.save();
        res.status(200).json({ message: 'Summary updated successfully', summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Regenerate a summary (generates new summary from article text)
export const regenerateSummary = async (req, res) => {
    try {
        const { id } = req.params;
        const { summaryText } = req.body;

        if (!summaryText) {
            return res.status(400).json({ error: 'Article text is required to regenerate summary' });
        }

        const summary = await Summary.findById(id);
        if (!summary) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        // Check if user owns this summary
        if (summary.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to regenerate this summary' });
        }

        // Generate new summary using AI
        let newSummaryText = await summariser(summaryText);

        // Update the summary with new generated text
        summary.summaryText = newSummaryText;
        summary.summaryLength = newSummaryText.split(' ').length;
        summary.updatedAt = Date.now();

        await summary.save();

        // Also update the article content
        const article = await Article.findOne({ summary: id });
        if (article) {
            article.content = summaryText;
            await article.save();
        }

        res.status(200).json({ message: 'Summary regenerated successfully', summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Delete a summary
export const deleteSummary = async (req, res) => {
    try {
        const { id } = req.params;

        const summary = await Summary.findById(id);   
        
        const article = await Article.findOne({ summary: id });

        if (!summary) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        //checking the authrization
        if (summary.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to delete this summary' });
        }

        //find the article with which it is attached too and delete that too
        await Article.findByIdAndDelete(summary._id);
        await Summary.findByIdAndDelete(id);

        res.status(200).json({ message: 'Summary deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}