const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const addToLeaderBoard = async (user, word) => {
    const { data, error } = await supabase
        .from('leaderboard')
        .insert([{
            user,
            word
        }])
}

module.exports = {
    addToLeaderBoard
};
