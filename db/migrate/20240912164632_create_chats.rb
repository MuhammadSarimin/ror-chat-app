class CreateChats < ActiveRecord::Migration[7.2]
  def change
    create_table :chats do |t|
      t.string :user_id
      t.string :user_name
      t.text :message

      t.timestamps
    end
  end
end
