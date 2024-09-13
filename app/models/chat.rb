class Chat < ApplicationRecord
  after_create_commit { broadcast_message }

  private

  def broadcast_message
      ActionCable.server.broadcast("MessagesChannel", {
                                      id:,
                                      user_id:,
                                      user_name:,
                                      message:
                                  })
  end
end
